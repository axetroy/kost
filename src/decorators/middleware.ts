import { resolveMiddleware } from "../middleware";
import Controller, { Controller$ } from "../controller";
/**
 * decorator of middleware
 * @param middlewareName
 * @param options
 */
export function USE(middlewareName: string, options?: any) {
  const MiddlewareFactory = resolveMiddleware(middlewareName);
  return function(
    target: Controller$,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    target.middleware = target.middleware || [];
    target.middleware.push({
      handler: propertyKey,
      factory: MiddlewareFactory,
      options
    });
  };
}
