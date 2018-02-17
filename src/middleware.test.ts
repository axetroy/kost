import test from "ava";
import * as path from "path";
import Middleware, {
  resolveMiddleware,
  MiddlewareFactory$
} from "./middleware";

const originCwd = process.cwd();

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
  const cwd = path.join(__dirname, "..", "..", "example");
  process.chdir(cwd);
  const LoggerMiddleware = resolveMiddleware("logger");
  t.true(LoggerMiddleware instanceof Middleware);
  t.throws(function() {
    // invalid middleware, it should throw an error
    resolveMiddleware("aabbcc");
  });
});
