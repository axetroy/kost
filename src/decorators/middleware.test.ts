import test from "ava";

import * as path from "path";
import { Use } from "./middleware";
import { resolveMiddleware } from "../middleware";
import Controller, { ControllerFactory$ } from "../controller";
import { MIDDLEWARE } from "../const";
import { paths, setCurrentWorkingDir } from "../path";

test("middleware decorator is only use in controller", async t => {
  setCurrentWorkingDir(
    path.join(process.cwd(), "build", "__test__", "middleware-test-example")
  );

  const LoggerMiddleware = resolveMiddleware("logger");

  console.log("加载logger middleware");

  let Factory: ControllerFactory$;
  t.notThrows(function() {
    class HomeController extends Controller {
      @Use("logger")
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
      @Use("logger")
      async index(ctx, next) {}
    }
  });
});
