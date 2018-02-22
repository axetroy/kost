"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../controller");
const const_1 = require("../const");
function request(method, path) {
    return function (target, propertyKey, descriptor) {
        if (target instanceof controller_1.default === false ||
            typeof target[propertyKey] !== "function") {
            throw new Error(`@${method} decorator is only for class method`);
        }
        const routers = target[const_1.ROUTER] || [];
        routers.push({
            path: path,
            method: method.toLocaleLowerCase(),
            handler: propertyKey
        });
        target[const_1.ROUTER] = routers;
    };
}
function Get(path) {
    return request("GET", path);
}
exports.Get = Get;
function Post(path) {
    return request("POST", path);
}
exports.Post = Post;
function Put(path) {
    return request("PUT", path);
}
exports.Put = Put;
function Delete(path) {
    return request("DELETE", path);
}
exports.Delete = Delete;
function Head(path) {
    return request("HEAD", path);
}
exports.Head = Head;
function Patch(path) {
    return request("PATCH", path);
}
exports.Patch = Patch;
function Options(path) {
    return request("OPTIONS", path);
}
exports.Options = Options;
function All(path) {
    return request("ALL", path);
}
exports.All = All;
//# sourceMappingURL=http.js.map