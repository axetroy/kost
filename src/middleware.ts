import { App$ } from "./app";
import * as Koa from "koa";

export interface Middleware$ {
  app: App$;
  config: any;
  pipe: Koa.Middleware;
}

export default class Middleware implements Middleware$ {
  public app: App$;
  public config: any = {};
  async pipe(ctx, next): Promise<any> {
    next();
  }
}
