import test from "ava";

import * as path from "path";
import { USE } from "./middleware";
import { resolveMiddleware } from "../middleware";
import Controller, { ControllerFactory$ } from "../controller";
import { MIDDLEWARE } from "../const";
import { paths } from "../path";

const originCwd = process.cwd();

test("middleware decorator is only use in controller", async t => {
  // 进入到example目录作为测试
  const cwd = path.join(__dirname, "..", "..", "example");
  paths.middleware = path.join(cwd, "middlewares"); // reset the middleware
  const LoggerMiddleware = resolveMiddleware("logger");
  process.chdir(cwd);
  let Factory: ControllerFactory$;
  t.notThrows(function() {
    class HomeController extends Controller {
      @USE("logger")
      async index(ctx, next) {
        ctx.body = "hello kost";
      }
    }
    Factory = HomeController;
  });

  const ctrl = new Factory();
  t.deepEqual(ctrl[MIDDLEWARE].length, 1);
  t.deepEqual(ctrl[MIDDLEWARE], [
    {
      handler: "index",
      factory: LoggerMiddleware,
      options: {}
    }
  ]);

  // if the decorator use in a customer class

  t.throws(function() {
    class Abc {
      router = [];
      middleware = [];
      @USE("logger")
      async index(ctx, next) {}
    }
  });
});
