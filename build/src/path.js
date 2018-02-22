"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const cwd = process.cwd();
const paths = {
    cwd,
    controller: path.join(cwd, "controllers"),
    config: path.join(cwd, "configs"),
    middleware: path.join(cwd, "middlewares"),
    service: path.join(cwd, "services"),
    static: path.join(cwd, "static"),
    view: path.join(cwd, "views")
};
exports.paths = paths;
//# sourceMappingURL=path.js.map