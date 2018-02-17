import test from "ava";

import * as path from "path";
import { GET } from "./decorators/http";
import Controller, { ControllerFactory$ } from "./controller";

const originCwd = process.cwd();

test("http decorator", async t => {
  let Factory: ControllerFactory$;
  t.notThrows(function() {
    class HomeController extends Controller {
      @GET("/index")
      async index(ctx, next) {
        ctx.body = "hello kost";
      }
    }
    Factory = HomeController;
  });

  const ctrl = new Factory();

  t.deepEqual(ctrl.router.length, 1);
  t.deepEqual(ctrl.router, [
    {
      path: "/index",
      method: "get",
      handler: "index"
    }
  ]);
});
