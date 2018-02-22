"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Service {
    constructor(options) {
        this.level = 0;
        this.enable = true;
        this.config = {};
        this.config = options || {};
    }
    async init() { }
}
exports.default = Service;
//# sourceMappingURL=service.js.map