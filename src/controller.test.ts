import test from "ava";

import * as path from "path";
import { Get } from "./decorators/http";
import Controller, { ControllerFactory$ } from "./controller";
import { ROUTER } from "./const";

const originCwd = process.cwd();

test("http decorator", async t => {
  let Factory: ControllerFactory$;
  t.notThrows(function() {
    class HomeController extends Controller {
      @Get("/index")
      async index(ctx, next) {
        ctx.body = "hello kost";
      }
    }
    Factory = HomeController;
  });

  const ctrl = new Factory();

  t.deepEqual(ctrl[ROUTER].length, 1);
  t.deepEqual(ctrl[ROUTER], [
    {
      path: "/index",
      method: "get",
      handler: "index"
    }
  ]);
});
