import test from "ava";

import * as path from "path";
import { USE } from "./middleware";
import { resolveMiddleware } from "../middleware";
import Controller, { ControllerFactory$ } from "../controller";

const originCwd = process.cwd();

test("middleware decorator is only use in controller", async t => {
  // 进入到example目录作为测试
  const cwd = path.join(__dirname, "..", "..", "example");
  const LoggerMiddleware = resolveMiddleware("logger", cwd);
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
  t.deepEqual(ctrl.middleware.length, 1);
  t.deepEqual(ctrl.middleware, [
    {
      handler: "index",
      factory: LoggerMiddleware,
      options: {}
    }
  ]);
});
