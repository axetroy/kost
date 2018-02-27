"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
let paths;
exports.paths = paths;
function setCurrentWorkingDir(cwd) {
    exports.paths = paths = paths || {};
    paths.cwd = cwd;
    paths.config = path.join(cwd, "configs");
    paths.controller = path.join(cwd, "controllers");
    paths.middleware = path.join(cwd, "middlewares");
    paths.service = path.join(cwd, "services");
    paths.static = path.join(cwd, "static");
    paths.view = path.join(cwd, "views");
}
exports.setCurrentWorkingDir = setCurrentWorkingDir;
setCurrentWorkingDir(process.cwd());
//# sourceMappingURL=path.js.map