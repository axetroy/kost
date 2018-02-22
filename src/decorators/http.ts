import Controller, { Controller$, Router$ } from "../controller";
import { Middleware$, MiddlewareFactory$ } from "../middleware";
import { ROUTER } from "../const";

/**
 * get controller request
 * @param method
 * @param path
 */
function request(method: string, path: string | RegExp) {
  return function(
    target: Controller$,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
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

export function GET(path: string | RegExp) {
  return request("GET", path);
}

export function POST(path: string | RegExp) {
  return request("POST", path);
}

export function PUT(path: string | RegExp) {
  return request("PUT", path);
}

export function DELETE(path: string | RegExp) {
  return request("DELETE", path);
}

export function HEAD(path: string | RegExp) {
  return request("HEAD", path);
}

export function PATCH(path: string | RegExp) {
  return request("PATCH", path);
}

export function OPTIONS(path: string | RegExp) {
  return request("OPTIONS", path);
}

export function ALL(path: string | RegExp) {
  return request("ALL", path);
}
