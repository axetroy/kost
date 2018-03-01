import test from "ava";

import * as path from "path";
import {Use} from "./middleware";
import {resolveMiddleware} from "../class/middleware";
import Controller, {ControllerFactory$} from "../class/controller";
import {MIDDLEWARE} from "../const";
import {setCurrentWorkingDir} from "../path";

test("middleware decorator is only use in controller", async t => {
  setCurrentWorkingDir(
    path.join(process.cwd(), "build", "__test__", "middleware-test-example")
  );

  const LoggerMiddleware = resolveMiddleware("logger");

  let Factory: ControllerFactory$;
  t.notThrows(function () {
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
  t.throws(function () {
    class Abc {
      router = [];
      middleware = [];

      @Use("logger")
      async index(ctx, next) {
      }
    }
  });
});
