import { Application$ } from "./app";

export interface Service$ {
  enable: boolean;
  level: number;
  init(app: Application$): Promise<any>;
}

export interface ServiceFactory$ {
  new (): Service$;
}

export default class Service implements Service$ {
  public level: number = 0; // the level of service
  public enable = true; // default true
  async init(): Promise<any> {}
}
