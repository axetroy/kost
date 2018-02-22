import * as Koa from "koa";
export interface Middleware$ {
    config: any;
    pipe: Koa.Middleware;
}
export interface MiddlewareFactory$ {
    new (): Middleware$;
}
export default class Middleware implements Middleware$ {
    config: any;
    constructor(options?: any);
    pipe(ctx: any, next: any): Promise<any>;
}
export declare function resolveMiddleware(middlewareName: string): MiddlewareFactory$;
