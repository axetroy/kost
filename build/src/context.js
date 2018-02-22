"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("./path");
let haveInit = false;
class Context {
    constructor() {
        this.config = {};
        this.params = {};
        this.paths = path_1.paths;
        if (haveInit) {
            throw new Error("The context have been init, please inject instead of new Context()");
        }
        else {
            haveInit = true;
        }
    }
    get env() {
        return process.env;
    }
}
exports.default = Context;
//# sourceMappingURL=context.js.map