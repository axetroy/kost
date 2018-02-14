import { App$ } from "./app";

export interface Service$ {
  app: App$;
  enable: boolean;
  level: number;
  init(app: App$): Promise<any>;
}

export default class Service implements Service$ {
  public app: App$;
  public level: number = 0; // the level of service
  public enable = true; // default true
  async init(): Promise<any> {}
}
