import { Application$ } from "./app";

export interface Service$ {
  enable: boolean;
  level: number;
  config: any;
  init(app: Application$): Promise<any>;
}

export interface ServiceFactory$ {
  new (): Service$;
}

export default class Service implements Service$ {
  public level: number = 0; // the level of service
  public enable = true; // default true
  public config: any = {};
  constructor(options?: any) {
    this.config = options || {};
  }
  async init(): Promise<any> {}
}
