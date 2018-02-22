import test from "ava";

import * as path from "path";
import { Get, Post, Put, Delete, Head, Patch, Options, All } from "./http";
import Controller, { ControllerFactory$ } from "../controller";
import { ROUTER } from "../const";

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

test("http decorator in customer controller should throw an error", async t => {
  let Factory: ControllerFactory$;
  t.throws(function() {
    class HomeController {
      router = [];
      middleware = [];
      @Post("/index")
      @Put("/index")
      @Delete("/index")
      @Head("/index")
      @Patch("/index")
      @All("/index")
      @Options("/index")
      async index(ctx, next) {
        ctx.body = "hello kost";
      }
    }
    Factory = HomeController;
  });
});
