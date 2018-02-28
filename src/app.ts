import "reflect-metadata";
import * as Koa from "koa";
import * as mount from "koa-mount";
import * as bodyParser from "koa-bodyparser";
import { Container } from "typedi";
import { Server } from "http";

import { loadController } from "./controller";
import { loadService } from "./service";
import Middleware, {
  Middleware$,
  resolveMiddleware,
  isValidMiddleware
} from "./middleware";
import {
  Config$,
  BodyParserConfig$,
  ViewConfig$,
  CorsConfig$,
  StaticFileServerConfig$,
  loadConfig
} from "./config";
import Context from "./context";
import { paths } from "./path";
import { CONTEXT, APP_MIDDLEWARE } from "./const";

export interface Application$ {
  start(config: Config$): Promise<Server>;
}

class Application extends Koa {
  constructor(private options: Config$ = {}) {
    super();
    this[CONTEXT] = Container.get(Context);
    this[APP_MIDDLEWARE] = [];
  }
  private async init(): Promise<Application> {
    // create global context
    this[CONTEXT] = Container.get(Context);

    // load config
    const config: any = await loadConfig();

    // set context;
    this[CONTEXT].config = config;
    this[CONTEXT].params = this.options;

    // enabled some feat
    if (this.options.enabled) {
      const { bodyParser, proxy, view, cors } = this.options.enabled;
      const staticServer = this.options.enabled.static;
      // enable body parser
      if (bodyParser) {
        let bodyParserConfig: BodyParserConfig$ = {};

        // 如果传入一个Object
        if (bodyParser !== true) {
          bodyParserConfig = bodyParser;
        }
        super.use(require("koa-bodyparser")(bodyParserConfig));
      }

      // enable static file server
      if (staticServer) {
        const FileServer = require("koa-static");
        let StaticFileServerConfig: StaticFileServerConfig$ = {
          mount: "/static"
        };

        // if pass an object
        if (staticServer !== true) {
          StaticFileServerConfig = Object.assign(
            StaticFileServerConfig,
            staticServer
          );
        }

        super.use(
          mount(
            StaticFileServerConfig.mount,
            FileServer(paths.static, StaticFileServerConfig)
          )
        );
      }

      // enable proxy
      if (proxy) {
        const proxyServer = require("koa-proxies");
        const options = proxy.options;

        // if not set rewrite
        if (!options.rewrite) {
          options.rewrite = path =>
            path.replace(new RegExp("^\\" + proxy.mount), "/");
        }

        super.use(proxyServer(proxy.mount, proxy.options));
      }

      // enable the view engine
      if (view) {
        let viewConfig: ViewConfig$ = {};
        if (view !== true) {
          viewConfig = view;
        }
        const views = require("koa-views");
        super.use(views(paths.view, viewConfig));
      }

      // enable cors
      if (cors) {
        let corsConfig: CorsConfig$ = {};
        if (cors !== true) {
          corsConfig = cors;
        }
        const corsMiddleware = require("koa-cors");
        super.use(corsMiddleware(corsConfig));
      }
    }

    // init service
    await loadService();

    // load global middleware
    const globalMiddleware = this[APP_MIDDLEWARE];
    globalMiddleware.forEach(element => {
      const { middlewareName, options } = element;
      const MiddlewareFactory = resolveMiddleware(middlewareName);

      const middleware: Middleware$ = new MiddlewareFactory();

      if (!isValidMiddleware(middleware)) {
        throw new Error(`Invalid middleware "${middlewareName}"`);
      }

      // set context and config for middleware
      middleware.config = options;

      const koaStyleMiddleware = middleware.pipe.bind(middleware);

      super.use(koaStyleMiddleware);
    });

    // load controller and generate router
    const router = await loadController();

    super.use(router.routes()).use(router.allowedMethods());
    return this;
  }

  async start(port?: number): Promise<Server> {
    await this.init();
    return super.listen(port || process.env.PORT || 3000);
  }
  /**
   * load middleware
   * @param middlewareName middleware name in /project/middlewares/:name or a npm package name
   * @param options
   */
  use(middlewareName: string | Koa.Middleware, options = {}) {
    this[APP_MIDDLEWARE].push({
      middlewareName,
      options
    });
    return this;
  }
}

export default Application;
