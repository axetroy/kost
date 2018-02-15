import { Controller$ } from "../controller";
import { Middleware$, MiddlewareFactory$ } from "../middleware";

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
    target.router = target.router || [];
    target.router.push({
      path: path,
      method: method.toLocaleLowerCase(),
      handler: propertyKey
    });
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

export function ALL(path: string | RegExp) {
  return request("ALL", path);
}
