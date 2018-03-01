import { Application$ } from "./app";
import { MiddlewareFactory$ } from "./middleware";
import { ROUTER, MIDDLEWARE } from "./const";
import { readdir } from "fs-extra";
import * as path from "path";
import { paths } from "./path";
import { Container } from "typedi";
import * as Router from "koa-router";
import { isValidMiddleware } from "./middleware";
import { getOutput } from "./utils";

export interface Router$ {
  method: string;
  path: string | RegExp;
  handler: string;
}

export interface ControllerMiddleware$ {
  handler: string;
  factory: MiddlewareFactory$;
  options?: any;
}

export interface ControllerFactory$ {
  new (): Controller$;
}

export interface Controller$ {}

export default class Controller implements Controller$ {
  constructor() {
    this[ROUTER] = this[ROUTER] || [];
    this[MIDDLEWARE] = this[MIDDLEWARE] || [];
  }
}

/**
 * check the object is a valid controller
 * @param c
 */
export function isValidController(c: any): boolean {
  return c instanceof Controller;
}

export async function loadController(): Promise<Router> {
  const controllerFiles = (await readdir(paths.controller)).filter(file =>
    /\.controller\.t|jsx?$/.test(file)
  );
  const controllers: Controller$[] = [];

  const env: string = process.env.NODE_ENV;

  // load controller
  while (controllerFiles.length) {
    const controllerFile = controllerFiles.shift();
    const filePath: string = path.join(paths.controller, controllerFile);
    const YourController = getOutput(require(filePath));

    const ctrl: Controller$ = Container.get(YourController);

    if (!isValidController(ctrl)) {
      throw new Error(`The file ${filePath} is not a controller file.`);
    }

    controllers.push(ctrl);
  }

  const router = new Router();

  // resolve controller
  for (let controller of controllers) {
    const routers: Router$[] = controller[ROUTER];
    for (let i = 0; i < routers.length; i++) {
      const route: Router$ = routers[i];
      const handler = controller[route.handler];

      // get the middleware for this route
      const controllerMiddleware = controller[MIDDLEWARE].filter(
        (m: ControllerMiddleware$) => m.handler === route.handler
      ).map((m: ControllerMiddleware$) => {
        const middleware = new m.factory();
        middleware.config = m.options;
        return middleware;
      });

      if (env !== "production") {
        console.log(`[${route.method.toUpperCase()}] ${route.path}`);
      }

      controllerMiddleware.forEach(m => {
        if (!isValidMiddleware(m)) {
          throw new Error(`Invalid middleware in controller .${route.handler}`);
        }
      });

      router[route.method](
        route.path,
        ...controllerMiddleware.map(m => m.pipe.bind(m)), // middleware
        async (ctx, next) => handler.call(controller, ctx, next)
      );
    }
  }

  return router;
}
