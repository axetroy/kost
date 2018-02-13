import { App$ } from "./app";

export interface Service$ {
  app: App$;
  level: number;
  init(app: App$): Promise<any>;
}

export default class Service implements Service$ {
  public app: App$;
  public level: number = 0; // 服务初始化的优先级
  async init(): Promise<any> {}
}
