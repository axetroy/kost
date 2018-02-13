import { App$ } from "./app";

interface Paths$ {
  [urlPath: string]: {
    [httpMethod: string]: string; // function method name
  };
}

export interface Controller$ {
  app: App$;
  paths: Paths$;
}

export default class Controller implements Controller$ {
  public app: App$;
  public paths: Paths$;
}
