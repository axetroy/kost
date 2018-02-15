import { Application$ } from "./app";

export interface Service$ {
  app: Application$;
  enable: boolean;
  level: number;
  init(app: Application$): Promise<any>;
}

export default class Service implements Service$ {
  public app: Application$;
  public level: number = 0; // the level of service
  public enable = true; // default true
  async init(): Promise<any> {}
}
