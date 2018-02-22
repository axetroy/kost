"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = process.env.NODE_ENV || "development";
const typedi_1 = require("typedi");
exports.Inject = typedi_1.Inject;
const app_1 = require("./src/app");
const controller_1 = require("./src/controller");
exports.Controller = controller_1.default;
const middleware_1 = require("./src/middleware");
exports.Middleware = middleware_1.default;
const service_1 = require("./src/service");
exports.Service = service_1.default;
const context_1 = require("./src/context");
exports.Context = context_1.default;
__export(require("./src/decorators"));
exports.default = app_1.default;
//# sourceMappingURL=index.js.map