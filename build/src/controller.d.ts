import { MiddlewareFactory$ } from "./middleware";
export interface Router$ {
    method: string;
    path: string | RegExp;
    handler: string;
}
export interface Middleware$ {
    handler: string;
    factory: MiddlewareFactory$;
    options?: any;
}
export interface ControllerFactory$ {
    new (): Controller$;
}
export interface Controller$ {
}
export default class Controller implements Controller$ {
    constructor();
}
