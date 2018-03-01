import { Middleware } from "../../../index";

export default class LoggerMiddleware extends Middleware {
  async pipe(ctx, next) {
    const before = new Date().getTime();
    await next();
    const after = new Date().getTime();
    const take = after - before;
    console.log(`[${ctx.req.method}]: ${ctx.req.url} ${take}ms`);
  }
}
