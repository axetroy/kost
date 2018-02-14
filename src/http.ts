import { Controller$ } from "./controller";
import { Middleware$ } from "./middleware";

/**
 * get controller request
 * @param method
 * @param path
 */
function request(
  method: string,
  path: string | RegExp,
  ...middleware: Middleware$[]
) {
  return function(
    target: Controller$,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    target.router = target.router || [];
    target.router.push({
      path: path,
      method: method.toLocaleLowerCase(),
      handler: propertyKey,
      middleware: [...middleware]
    });
  };
}

export function GET(path: string | RegExp, ...middleware: Middleware$[]) {
  return request("GET", path, ...middleware);
}

export function POST(path: string | RegExp, ...middleware: Middleware$[]) {
  return request("POST", path, ...middleware);
}

export function PUT(path: string | RegExp, ...middleware: Middleware$[]) {
  return request("PUT", path, ...middleware);
}

export function DELETE(path: string | RegExp, ...middleware: Middleware$[]) {
  return request("DELETE", path, ...middleware);
}

export function HEAD(path: string | RegExp, ...middleware: Middleware$[]) {
  return request("HEAD", path, ...middleware);
}

export function PATCH(path: string | RegExp, ...middleware: Middleware$[]) {
  return request("PATCH", path, ...middleware);
}

export function ALL(path: string | RegExp, ...middleware: Middleware$[]) {
  return request("ALL", path, ...middleware);
}
