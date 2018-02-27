"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const fs = require("fs-extra");
const path = require("path");
const Koa = require("koa");
const Router = require("koa-router");
const mount = require("koa-mount");
const typedi_1 = require("typedi");
const controller_1 = require("./controller");
const service_1 = require("./service");
const middleware_1 = require("./middleware");
const config_1 = require("./config");
const context_1 = require("./context");
const const_1 = require("./const");
const path_1 = require("./path");
class Application {
    constructor() {
        this.app = new Koa();
    }
    async start(startOptions = {}) {
        const controllerFiles = (await fs.readdir(path_1.paths.controller)).filter(file => /\.controller\.t|js$/.test(file));
        const serviceFiles = (await fs.readdir(path_1.paths.service)).filter(file => /\.service.t|js$/.test(file));
        const app = this.app;
        const context = typedi_1.Container.get(context_1.default);
        const config = await config_1.loadConfig();
        context.config = config;
        context.params = startOptions;
        if (startOptions.enabled) {
            const { bodyParser, proxy, view, cors } = startOptions.enabled;
            const staticServer = startOptions.enabled.static;
            if (bodyParser) {
                let bodyParserConfig = {};
                if (bodyParser !== true) {
                    bodyParserConfig = bodyParser;
                }
                app.use(require("koa-bodyparser")(bodyParserConfig));
            }
            if (staticServer) {
                const FileServer = require("koa-static");
                let StaticFileServerConfig = {
                    mount: "/static"
                };
                if (staticServer !== true) {
                    StaticFileServerConfig = Object.assign(StaticFileServerConfig, staticServer);
                }
                app.use(mount(StaticFileServerConfig.mount, FileServer(path_1.paths.static, StaticFileServerConfig)));
            }
            if (proxy) {
                const proxyServer = require("koa-proxies");
                const options = proxy.options;
                if (!options.rewrite) {
                    options.rewrite = path => path.replace(new RegExp("^\\" + proxy.mount), "/");
                }
                app.use(proxyServer(proxy.mount, proxy.options));
            }
            if (view) {
                let viewConfig = {};
                if (view !== true) {
                    viewConfig = view;
                }
                const views = require("koa-views");
                app.use(views(path_1.paths.view, viewConfig));
            }
            if (cors) {
                let corsConfig = {};
                if (cors !== true) {
                    corsConfig = cors;
                }
                const corsMiddleware = require("koa-cors");
                app.use(corsMiddleware(corsConfig));
            }
        }
        const services = serviceFiles
            .map(serviceFile => {
            const filePath = path.join(path_1.paths.service, serviceFile);
            let ServiceFactory = require(filePath);
            ServiceFactory = ServiceFactory.default
                ? ServiceFactory.default
                : service_1.default;
            const service = typedi_1.Container.get(ServiceFactory);
            if (service instanceof service_1.default === false) {
                throw new Error(`The file ${filePath} is not a service file.`);
            }
            return service;
        })
            .sort((a) => -a.level);
        while (services.length) {
            const service = services.shift();
            if (service) {
                await service.init(this);
            }
        }
        const controllers = [];
        while (controllerFiles.length) {
            const controllerFile = controllerFiles.shift();
            const filePath = path.join(path_1.paths.controller, controllerFile);
            let YourController = require(filePath);
            YourController = YourController.default
                ? YourController.default
                : YourController;
            const ctrl = typedi_1.Container.get(YourController);
            if (ctrl instanceof controller_1.default === false) {
                throw new Error(`The file ${filePath} is not a controller file.`);
            }
            controllers.push(ctrl);
        }
        const router = new Router();
        for (let controller of controllers) {
            const routers = controller[const_1.ROUTER];
            for (let i = 0; i < routers.length; i++) {
                const route = routers[i];
                const handler = controller[route.handler];
                const middlewares = (controller[const_1.MIDDLEWARE] || [])
                    .filter((m) => m.handler === route.handler)
                    .map((m) => {
                    const middleware = new m.factory();
                    middleware.config = m.options;
                    return middleware;
                });
                if (process.env.NODE_ENV === "development") {
                    console.log(`[${route.method.toUpperCase()}] ${route.path}`);
                }
                middlewares.array.forEach(m => {
                    if (!middleware_1.isValidMiddleware(m)) {
                        throw new Error(`Invalid middleware`);
                    }
                });
                router[route.method](route.path, ...middlewares.map(m => m.pipe.bind(m)), async (ctx, next) => handler.call(controller, ctx, next));
            }
        }
        app.use(router.routes()).use(router.allowedMethods());
        return app.listen(startOptions.port || process.env.PORT || 3000);
    }
    use(middlewareName, options = {}) {
        const app = this.app;
        const MiddlewareFactory = middleware_1.resolveMiddleware(middlewareName);
        const middleware = new MiddlewareFactory();
        if (!middleware_1.isValidMiddleware(middleware)) {
            throw new Error(`Invalid middleware "${middlewareName}"`);
        }
        middleware.config = options;
        app.use(middleware.pipe.bind(middleware));
        return this;
    }
}
exports.default = Application;
//# sourceMappingURL=app.js.map