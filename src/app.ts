import "reflect-metadata";
import * as fs from "fs-extra";
import * as path from "path";
import * as Koa from "koa";
import * as Router from "koa-router";
import * as mount from "koa-mount";
import * as bodyParser from "koa-bodyparser";
import * as yaml from "js-yaml";
import { Container } from "typedi";

import Controller, {
  Controller$,
  Router$,
  Middleware$ as ControllerMiddleware$
} from "./controller";
import Service, { Service$ } from "./service";
import Middleware, { Middleware$, resolveMiddleware } from "./middleware";
import {
  Config$,
  BodyParserConfig$,
  ViewConfig$,
  CorsConfig$,
  StaticFileServerConfig$
} from "./config";
import Context from "./context";
import { ROUTER, MIDDLEWARE } from "./const";
import { paths } from "./path";

export interface Application$ {
  start(config: Config$): Promise<any>;
}

class Application implements Application$ {
  private app = new Koa();
  /**
   * start the server
   * @param startOptions
   */
  async start(startOptions: Config$ = {}) {
    const defaultConfigPath = path.join(paths.config, "default.config.yaml");
    const envConfigPath = path.join(
      paths.config,
      process.env.NODE_ENV + ".config.yaml"
    );

    const controllerFiles = (await fs.readdir(paths.controller)).filter(file =>
      /\.controller\.t|js$/.test(file)
    );
    const serviceFiles = (await fs.readdir(paths.service)).filter(file =>
      /\.service.t|js$/.test(file)
    );

    const app = this.app;

    // create global context
    const context = Container.get(Context);

    // load default config if it exist
    const defaultConfig = (await fs.pathExists(defaultConfigPath))
      ? yaml.safeLoad(await fs.readFile(defaultConfigPath, "utf8"))
      : {};

    // load env config if it exist
    const envConfig = (await fs.pathExists(envConfigPath))
      ? yaml.safeLoad(fs.readFileSync(envConfigPath, "utf8"))
      : {};

    const config: any = Object.assign(defaultConfig, envConfig);

    // set context;
    context.config = config;
    context.params = startOptions;

    // enabled some feat
    if (startOptions.enabled) {
      const { bodyParser, proxy, view, cors } = startOptions.enabled;
      const staticServer = startOptions.enabled.static;
      // enable body parser
      if (bodyParser) {
        let bodyParserConfig: BodyParserConfig$ = {};

        // 如果传入一个Object
        if (bodyParser !== true) {
          bodyParserConfig = bodyParser;
        }
        app.use(require("koa-bodyparser")(bodyParserConfig));
      }

      // enable static file server
      if (staticServer) {
        const FileServer = require("koa-static");
        let StaticFileServerConfig: StaticFileServerConfig$ = {
          mount: "/static"
        };

        // if pass an object
        if (staticServer !== true) {
          StaticFileServerConfig = Object.assign(
            StaticFileServerConfig,
            staticServer
          );
        }

        app.use(
          mount(
            StaticFileServerConfig.mount,
            FileServer(paths.static, StaticFileServerConfig)
          )
        );
      }

      // enable proxy
      if (proxy) {
        const proxyServer = require("koa-proxies");
        const options = proxy.options;

        // if not set rewrite
        if (!options.rewrite) {
          options.rewrite = path =>
            path.replace(new RegExp("^\\" + proxy.mount), "/");
        }

        app.use(proxyServer(proxy.mount, proxy.options));
      }

      // enable the view engine
      if (view) {
        let viewConfig: ViewConfig$ = {};
        if (view !== true) {
          viewConfig = view;
        }
        const views = require("koa-views");
        app.use(views(paths.view, viewConfig));
      }

      // enable cors
      if (cors) {
        let corsConfig: CorsConfig$ = {};
        if (cors !== true) {
          corsConfig = cors;
        }
        const corsMiddleware = require("koa-cors");
        app.use(corsMiddleware(corsConfig));
      }
    }

    // init service
    const services: Service$[] = serviceFiles
      .map(serviceFile => {
        const filePath: string = path.join(paths.service, serviceFile);
        let ServiceFactory = require(filePath);
        ServiceFactory = ServiceFactory.default
          ? ServiceFactory.default
          : Service;
        const service = <Service$>Container.get(ServiceFactory);
        if (service instanceof Service === false) {
          throw new Error(`The file ${filePath} is not a service file.`);
        }
        return service;
      })
      .sort((a: Service$) => -a.level);

    while (services.length) {
      const service = services.shift();
      if (service) {
        await service.init(this);
      }
    }

    const controllers: Controller$[] = [];

    // load controller
    while (controllerFiles.length) {
      const controllerFile = controllerFiles.shift();
      const filePath: string = path.join(paths.controller, controllerFile);
      let YourController = require(filePath);
      YourController = YourController.default
        ? YourController.default
        : YourController;

      const ctrl: Controller$ = Container.get(YourController);

      if (ctrl instanceof Controller === false) {
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
        const middlewares = (controller[MIDDLEWARE] || [])
          .filter((m: ControllerMiddleware$) => m.handler === route.handler)
          .map((m: ControllerMiddleware$) => {
            const middleware = new m.factory();
            middleware.config = m.options;
            return middleware;
          });

        router[route.method](
          route.path,
          ...middlewares.map(m => m.pipe.bind(m)), // middleware
          async (ctx, next) => handler.call(controller, ctx, next)
        );
      }
    }

    app.use(router.routes()).use(router.allowedMethods());

    return app.listen(startOptions.port || process.env.PORT || 3000);
  }
  /**
   * load middleware
   * @param middlewareName middleware name in /project/middlewares/:name or a npm package name
   * @param options
   */
  use(middlewareName: string, options = {}) {
    const app = this.app;
    const MiddlewareFactory = resolveMiddleware(middlewareName);

    const middleware: Middleware$ = new MiddlewareFactory();

    // if middleware is not inherit from Middleware
    if (middleware instanceof Middleware === false) {
      throw new Error(`Invalid middleware "${middlewareName}"`);
    }

    // set context and config for middleware
    middleware.config = options;

    app.use(middleware.pipe.bind(middleware));

    return this;
  }
}

export default Application;
