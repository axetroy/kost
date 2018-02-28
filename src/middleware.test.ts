import test from "ava";
import * as path from "path";
import Middleware, {
  resolveMiddleware,
  MiddlewareFactory$,
  isValidMiddleware
} from "./middleware";
import Kost from "./app";
import * as request from "supertest";

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
  const cwd = path.join(__dirname, "..", "__test__", "middleware-test-example");
  setCurrentWorkingDir(cwd);
  t.notThrows(() => {
    const LoggerMiddleware = resolveMiddleware("logger");
    // t.true(LoggerMiddleware instanceof Middleware);
  });
  t.throws(function() {
    // invalid middleware, it should throw an error
    resolveMiddleware("aabbcc");
  });

  // setup server
  const app = new Kost().use("logger");
  await (<any>app).init();

  const server = request(app.callback());

  await new Promise((resolve, reject) => {
    server.get("/").end((err, res) => (err ? reject(err) : resolve(res)));
  });

  t.pass();
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
