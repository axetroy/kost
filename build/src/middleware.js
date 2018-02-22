"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const path_1 = require("./path");
class Middleware {
    constructor(options) {
        this.config = {};
        this.config = options || {};
    }
    async pipe(ctx, next) {
        next();
    }
}
exports.default = Middleware;
function resolveMiddleware(middlewareName) {
    let MiddlewareFactory;
    let moduleOutput;
    try {
        const localMiddlewarePath = path.join(path_1.paths.middleware, middlewareName + ".middleware");
        moduleOutput = require(localMiddlewarePath);
    }
    catch (err) {
        try {
            moduleOutput = require(middlewareName);
        }
        catch (err) {
            throw new Error(`Can not found the middleware "${middlewareName}"`);
        }
    }
    MiddlewareFactory = moduleOutput.default
        ? moduleOutput.default
        : moduleOutput;
    return MiddlewareFactory;
}
exports.resolveMiddleware = resolveMiddleware;
//# sourceMappingURL=middleware.js.map