"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middleware_1 = require("../middleware");
const controller_1 = require("../controller");
const const_1 = require("../const");
function Use(middlewareName, options = {}) {
    const MiddlewareFactory = middleware_1.resolveMiddleware(middlewareName);
    return function (target, propertyKey, descriptor) {
        if (target instanceof controller_1.default === false ||
            typeof target[propertyKey] !== "function") {
            throw new Error("@USE() decorator only for controller method");
        }
        const middlewares = target[const_1.MIDDLEWARE] || [];
        middlewares.push({
            handler: propertyKey,
            factory: MiddlewareFactory,
            options
        });
        target[const_1.MIDDLEWARE] = middlewares;
    };
}
exports.Use = Use;
//# sourceMappingURL=middleware.js.map