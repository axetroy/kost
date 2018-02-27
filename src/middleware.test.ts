import test from "ava";
import * as path from "path";
import Middleware, {
  resolveMiddleware,
  MiddlewareFactory$,
  isValidMiddleware
} from "./middleware";

import { setCurrentWorkingDir } from "./path";

test("service", async t => {
  let MiddlewareFactory: MiddlewareFactory$;
  class MyMiddleware extends Middleware {
    async pipe(ctx, next) {
      next();
    }
  }
  const middleware = new MyMiddleware();
  // default
  t.deepEqual(middleware.config, {});
});

test("resolveMiddleware", async t => {
  const cwd = path.join(__dirname, "..", "example");
  setCurrentWorkingDir(cwd);
  const LoggerMiddleware = resolveMiddleware("logger");
  // t.true(LoggerMiddleware instanceof Middleware);
  t.throws(function() {
    // invalid middleware, it should throw an error
    resolveMiddleware("aabbcc");
  });
});

test("isValidMiddleware", async t => {
  t.false(isValidMiddleware(new Middleware()));

  class MyMiddleware extends Middleware {
    async pipe(ctx, next) {
      next();
    }
  }

  t.true(isValidMiddleware(new MyMiddleware()));

  class MiddlewareWithoutPipe extends Middleware {}

  t.false(isValidMiddleware(new MiddlewareWithoutPipe()));
});
