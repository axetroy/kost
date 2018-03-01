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
    async pipe(ctx, next) {}
  }
  const middleware = new MyMiddleware();
  // default
  t.deepEqual(middleware.config, {});
});

test.serial("resolve valid Middleware", async t => {
  const cwd = path.join(__dirname, "..", "__test__", "middleware-test-example");
  setCurrentWorkingDir(cwd);
  t.notThrows(() => {
    const LoggerMiddleware = resolveMiddleware("logger");
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

test.serial("resolve invalid Middleware", async t => {
  const cwd = path.join(
    __dirname,
    "..",
    "__test__",
    "invalid-middleware-test-example"
  );
  setCurrentWorkingDir(cwd);
  t.notThrows(() => {
    const LoggerMiddleware = resolveMiddleware("limit");
  });

  // setup server
  const app = new Kost().use("limit");

  try {
    await (<any>app).init();
    t.fail("Middleware is invalid, it should be fail.");
  } catch (err) {
    t.true(err instanceof Error);
  }
});

test.serial("compatible with koa middleware", async t => {
  // setup server
  const app = new Kost().use(function(ctx, next) {
    ctx.body = "hello koa middleware";
  });

  // it should be init success
  await (<any>app).init();

  const server = request(app.callback());

  const res: any = await new Promise((resolve, reject) => {
    server.get("/").end((err, res) => (err ? reject(err) : resolve(res)));
  });

  t.deepEqual(res.text, "hello koa middleware");
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
