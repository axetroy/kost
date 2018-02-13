import { Controller$ } from "./controller";

/**
 * get controller request
 * @param method
 * @param path
 */
function request(method: string, path: string) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // 注册路由
    target.paths = target.paths || {};

    target.paths[path] = target.paths[path] || {};

    target.paths[path][method] = propertyKey;

  };
}

export function GET(path: string) {
  return request("GET", path);
}

export function POST(path: string) {
  return request("POST", path);
}

export function PUT(path: string) {
  return request("PUT", path);
}

export function DELETE(path: string) {
  return request("DELETE", path);
}
