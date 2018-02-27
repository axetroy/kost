import { resolveMiddleware } from "../middleware";
import Controller, { Controller$, ControllerMiddleware$ } from "../controller";
import { MIDDLEWARE } from "../const";
/**
 * decorator of controller to inject the middleware
 * @param middlewareName
 * @param options
 */
export function Use(middlewareName: string, options: any = {}) {
  const MiddlewareFactory = resolveMiddleware(middlewareName);
  return function(
    target: Controller$,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    if (
      target instanceof Controller === false ||
      typeof target[propertyKey] !== "function"
    ) {
      throw new Error("@USE() decorator only for controller method");
    }
    const controllerMiddleware: ControllerMiddleware$[] =
      target[MIDDLEWARE] || [];
    controllerMiddleware.push({
      handler: propertyKey,
      factory: MiddlewareFactory,
      options
    });
    target[MIDDLEWARE] = controllerMiddleware;
  };
}
