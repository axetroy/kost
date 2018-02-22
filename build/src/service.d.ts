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
    level: number;
    enable: boolean;
    config: any;
    constructor(options?: any);
    init(): Promise<any>;
}
