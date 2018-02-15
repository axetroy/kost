import { Application$ } from "./app";
import { MiddlewareFactory$ } from "./middleware";

interface Router$ {
  method: string;
  path: string | RegExp;
  handler: string;
}

interface Middleware$ {
  handler: string;
  factory: MiddlewareFactory$;
  options?: any;
}

export interface ControllerFactory$ {
  new (): Controller$;
}

export interface Controller$ {
  router: Router$[];
  middleware: Middleware$[];
}

export default class Controller implements Controller$ {
  public router: Router$[] = [];
  public middleware: Middleware$[] = [];
}
