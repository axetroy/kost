import "reflect-metadata";
import * as fs from "fs";
import * as path from "path";
import * as Koa from "koa";
import * as Router from "koa-router";
import { Container } from "typedi";

import Controller, { Controller$ } from "./controller";
import Service, { Service$ } from "./service";

interface Config$ {
  cluster: number;
}

interface AppService$ {
  [name: string]: any;
}

export interface App$ {
  service: AppService$;
  start(config: Config$): Promise<any>;
}

class App implements App$ {
  private app = new Koa();
  private controllers: Controller$[] = [];
  public service: AppService$ = {};
  async start(config: Config$) {
    const controllerDir = path.join(process.cwd(), "controllers");
    const serviceDir = path.join(process.cwd(), "services");
    const controllerFiles = fs.readdirSync(controllerDir);
    const serviceFiles = fs.readdirSync(serviceDir);

    // 初始化service

    const services: Service$[] = serviceFiles
      .filter(
        serviceFile => [".js", ".ts"].indexOf(path.extname(serviceFile)) >= 0
      )
      .map(serviceFile => {
        const filePath: string = path.join(serviceDir, serviceFile);
        let YourService = require(filePath);
        YourService = YourService.default ? YourService.default : Service;
        const service = <Service$>Container.get(YourService);
        if (service instanceof Service === false) {
          throw new Error(`The file ${filePath} is not a service file.`);
        }
        return service;
      })
      .sort((a: Service$) => -a.level);

    while (services.length) {
      const service = services.shift();
      if (service) {
        await service.init(this);
      }
    }

    // 加载控制器
    while (controllerFiles.length) {
      const controllerFile = controllerFiles.shift();

      if (controllerFile) {
        switch (path.extname(controllerFile)) {
          case ".js":
          case ".ts":
            const filePath: string = path.join(controllerDir, controllerFile);
            let YourController = require(filePath);
            YourController = YourController.default
              ? YourController.default
              : YourController;

            const ctrl: Controller$ = Container.get(YourController);

            if (ctrl instanceof Controller === false) {
              throw new Error(`The file ${filePath} is not a controller file.`);
            }

            ctrl.app = this;
            this.controllers.push(ctrl);
            break;
          default:
            break;
        }
      }
    }

    const router = new Router();

    // 处理Controller
    for (let controller of this.controllers) {
      for (let urlPath in controller.paths) {
        const methods = controller.paths[urlPath];
        for (let httpMethod in methods) {
          const handler = controller[methods[httpMethod]];
          router[httpMethod.toLocaleLowerCase()](urlPath, async (ctx, next) =>
            handler.call(controller, ctx, next)
          );
        }
      }
    }

    this.app.use(router.routes()).use(router.allowedMethods());

    return this.app.listen(3000);
  }
  use(middleware) {
    this.app.use(middleware);
  }
}

export default App;
