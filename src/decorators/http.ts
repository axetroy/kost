import Controller, {Controller$, Router$} from "../class/controller";
import {ROUTER} from "../const";

/**
 * decorator for controller
 * @param method
 * @param path
 */
function request(method: string, path: string | RegExp) {
  return function (target: Controller$,
                   propertyKey: string,
                   descriptor: PropertyDescriptor) {
    if (
      target instanceof Controller === false ||
      typeof target[propertyKey] !== "function"
    ) {
      throw new Error(`@${method} decorator is only for class method`);
    }
    const routers: Router$[] = target[ROUTER] || [];
    routers.push({
      path: path,
      method: method.toLocaleLowerCase(),
      handler: propertyKey
    });
    target[ROUTER] = routers;
  };
}

export function Get(path: string | RegExp) {
  return request("GET", path);
}

export function Post(path: string | RegExp) {
  return request("POST", path);
}

export function Put(path: string | RegExp) {
  return request("PUT", path);
}

export function Delete(path: string | RegExp) {
  return request("DELETE", path);
}

export function Head(path: string | RegExp) {
  return request("HEAD", path);
}

export function Patch(path: string | RegExp) {
  return request("PATCH", path);
}

export function Options(path: string | RegExp) {
  return request("OPTIONS", path);
}

export function All(path: string | RegExp) {
  return request("ALL", path);
}
