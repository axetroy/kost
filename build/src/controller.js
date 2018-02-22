"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("./const");
class Controller {
    constructor() {
        this[const_1.ROUTER] = this[const_1.ROUTER] || [];
        this[const_1.MIDDLEWARE] = this[const_1.MIDDLEWARE] || [];
    }
}
exports.default = Controller;
//# sourceMappingURL=controller.js.map