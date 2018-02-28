import { Application$ } from "./app";
import { readdir, pathExists } from "fs-extra";
import * as path from "path";
import { paths } from "./path";
import { Container } from "typedi";

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

/**
 * check is a valid service or not
 * @param s
 */
export function isValidService(s: any): boolean {
  return s instanceof Service;
}

/**
 * load service
 */
export async function loadService(): Promise<void> {
  const serviceFiles: string[] = ((await pathExists(paths.service))
    ? await readdir(paths.service)
    : []
  ).filter(file => /\.service.t|jsx?$/.test(file));

  // init service
  const services: Service$[] = serviceFiles
    .map(serviceFile => {
      const filePath: string = path.join(paths.service, serviceFile);
      let ServiceFactory = require(filePath);
      ServiceFactory = ServiceFactory.default
        ? ServiceFactory.default
        : Service;
      const service = <Service$>Container.get(ServiceFactory);
      if (!isValidService(service)) {
        throw new Error(`The file ${filePath} is not a service file.`);
      }
      return service;
    })
    .sort((a: Service$) => -a.level); // sort by service's level

  while (services.length) {
    const service = services.shift();
    if (service) {
      await service.init(this);
    }
  }
}
