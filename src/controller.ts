import { App$ } from "./app";
import { Middleware$ } from "./middleware";

interface Router$ {
  method: string;
  path: string | RegExp;
  handler: string;
  middleware: Middleware$[];
}

export interface Controller$ {
  app: App$;
  router: Router$[];
}

export default class Controller implements Controller$ {
  public app: App$;
  public router: Router$[];
}
