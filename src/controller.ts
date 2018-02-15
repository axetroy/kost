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
  app: Application$;
  router: Router$[];
  middleware: Middleware$[];
}

export default class Controller implements Controller$ {
  public app: Application$;
  public router: Router$[];
  public middleware: Middleware$[];
}
