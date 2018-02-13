import { App$ } from "./app";

export interface Middleware$ {
  app: App$;
  pipe(ctx: any, next: () => Promise<any>): Promise<any>;
}

export default class Middleware implements Middleware$ {
  public app: App$;
  async pipe(ctx, next): Promise<any> {
    next();
  }
}
