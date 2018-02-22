import { resolveMiddleware } from "../middleware";
import Controller, {
  Controller$,
  Middleware$ as ControllerMiddleware$
} from "../controller";
import { MIDDLEWARE } from "../const";
/**
 * decorator of middleware
 * @param middlewareName
 * @param options
 */
export function USE(middlewareName: string, options: any = {}) {
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
    const middlewares: ControllerMiddleware$[] = target[MIDDLEWARE] || [];
    middlewares.push({
      handler: propertyKey,
      factory: MiddlewareFactory,
      options
    });
    target[MIDDLEWARE] = middlewares;
  };
}
