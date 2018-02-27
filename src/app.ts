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

export interface Application$ {
  start(config: Config$): Promise<Server>;
}

class Application implements Application$ {
  private app = new Koa();
  /**
   * start the server
   * @param startOptions
   */
  async start(startOptions: Config$ = {}) {
    const app = this.app;

    // create global context
    const context = Container.get(Context);

    // load config
    const config: any = await loadConfig();

    // set context;
    context.config = config;
    context.params = startOptions;

    // enabled some feat
    if (startOptions.enabled) {
      const { bodyParser, proxy, view, cors } = startOptions.enabled;
      const staticServer = startOptions.enabled.static;
      // enable body parser
      if (bodyParser) {
        let bodyParserConfig: BodyParserConfig$ = {};

        // 如果传入一个Object
        if (bodyParser !== true) {
          bodyParserConfig = bodyParser;
        }
        app.use(require("koa-bodyparser")(bodyParserConfig));
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

        app.use(
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

        app.use(proxyServer(proxy.mount, proxy.options));
      }

      // enable the view engine
      if (view) {
        let viewConfig: ViewConfig$ = {};
        if (view !== true) {
          viewConfig = view;
        }
        const views = require("koa-views");
        app.use(views(paths.view, viewConfig));
      }

      // enable cors
      if (cors) {
        let corsConfig: CorsConfig$ = {};
        if (cors !== true) {
          corsConfig = cors;
        }
        const corsMiddleware = require("koa-cors");
        app.use(corsMiddleware(corsConfig));
      }
    }

    // init service
    await loadService();

    // load controller and generate router
    const router = await loadController();

    app.use(router.routes()).use(router.allowedMethods());

    return app.listen(startOptions.port || process.env.PORT || 3000);
  }
  /**
   * load middleware
   * @param middlewareName middleware name in /project/middlewares/:name or a npm package name
   * @param options
   */
  use(middlewareName: string, options = {}) {
    const app = this.app;
    const MiddlewareFactory = resolveMiddleware(middlewareName);

    const middleware: Middleware$ = new MiddlewareFactory();

    if (!isValidMiddleware(middleware)) {
      throw new Error(`Invalid middleware "${middlewareName}"`);
    }

    // set context and config for middleware
    middleware.config = options;

    app.use(middleware.pipe.bind(middleware));

    return this;
  }
}

export default Application;
