import * as path from "path";
import { Application$ } from "./app";
import * as Koa from "koa";
import { paths } from "./path";
import { getOutput } from "./utils";

export interface Middleware$ {
  config: any;
  pipe: Koa.Middleware;
}

export interface MiddlewareFactory$ {
  new (): Middleware$;
}

export default class Middleware implements Middleware$ {
  public config: any = {};
  constructor(options?: any) {
    this.config = options || {};
  }
  /**
   * the pipe function, same with koa middleware
   * @param ctx
   * @param next
   */
  async pipe(ctx, next): Promise<any> {
    
  }
}

/**
 * 通过中间件的字符串，获取中间件类
 * @param middlewareName
 * @param cwd
 */
export function resolveMiddleware(
  middlewareName: string | Koa.Middleware
): MiddlewareFactory$ {
  if (typeof middlewareName === "function") {
    return class KoaMiddleware extends Middleware {
      async pipe(ctx, next) {
        return middlewareName(ctx, next);
      }
    };
  }

  let MiddlewareFactory: MiddlewareFactory$;
  try {
    const localMiddlewarePath = path.join(
      paths.middleware,
      middlewareName + ".middleware"
    );
    // require from local
    MiddlewareFactory = getOutput(require(localMiddlewarePath));
  } catch (err) {
    // if not found in local middleware dir
    // require from node_modules
    try {
      MiddlewareFactory = getOutput(require(middlewareName));
    } catch (err) {
      throw new Error(`Can not found the middleware "${middlewareName}"`);
    }
  }

  return MiddlewareFactory;
}

const defaultMiddleware = new Middleware();

/**
 * check the object is a valid middleware or not
 * @param m
 */
export function isValidMiddleware(m: any): boolean {
  return m instanceof Middleware && m.pipe !== defaultMiddleware.pipe;
}
