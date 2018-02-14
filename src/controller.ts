import { App$ } from "./app";

interface Router$ {
  method: string;
  path: string | RegExp;
  handler: string;
}

export interface Controller$ {
  app: App$;
  router: Router$[];
}

export default class Controller implements Controller$ {
  public app: App$;
  public router: Router$[];
}
