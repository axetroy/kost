import { App$ } from "./app";
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
  app: App$;
  router: Router$[];
  middleware: Middleware$[];
}

export default class Controller implements Controller$ {
  public app: App$;
  public router: Router$[];
  public middleware: Middleware$[];
}
