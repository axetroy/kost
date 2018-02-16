import * as path from "path";
import { Application$ } from "./app";
import * as Koa from "koa";

export interface Middleware$ {
  config: any;
  pipe: Koa.Middleware;
}

export interface MiddlewareFactory$ {
  new (): Middleware$;
}

export default class Middleware implements Middleware$ {
  public config: any = {};
  constructor(options) {
    this.config = options;
  }
  async pipe(ctx, next): Promise<any> {
    next();
  }
}

/**
 * 通过中间件的字符串，获取中间件类
 * @param middlewareName
 * @param cwd
 */
export function resolveMiddleware(
  middlewareName: string,
  cwd: string = process.cwd()
): MiddlewareFactory$ {
  let MiddlewareFactory: MiddlewareFactory$;
  let moduleOutput: any;
  try {
    const localMiddlewarePath = path.join(cwd, "middlewares", middlewareName);
    // require from local
    moduleOutput = require(localMiddlewarePath);
  } catch (err) {
    // require from node_modules
    try {
      moduleOutput = require(middlewareName);
    } catch (err) {
      throw new Error(`Can not found the middleware "${middlewareName}"`);
    }
  }

  MiddlewareFactory = moduleOutput.default
    ? moduleOutput.default
    : moduleOutput;

  return MiddlewareFactory;
}
