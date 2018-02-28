import test from "ava";

import * as path from "path";
import { Get, Post, Put, Delete, Head, Patch, Options, All } from "./http";
import Controller, { ControllerFactory$ } from "../controller";
import { ROUTER } from "../const";

test("http decorator", async t => {
  let Factory: ControllerFactory$;
  t.notThrows(function() {
    class HomeController extends Controller {
      @Get("/index")
      @Post("/index")
      @Put("/index")
      @Head("/index")
      @Patch("/index")
      @All("/index")
      @Options("/index")
      async index(ctx, next) {
        ctx.body = "hello kost";
      }
      @Delete("/a")
      async del() {}
    }
    Factory = HomeController;
  });

  const ctrl = new Factory();

  t.deepEqual(ctrl[ROUTER].length, 8);
});

test("http decorator in customer controller should throw an error", async t => {
  let Factory: ControllerFactory$;
  t.throws(function() {
    class HomeController {
      @Post("/index")
      async index(ctx, next) {
        ctx.body = "hello kost";
      }
    }
    Factory = HomeController;
  });
});

test("http decorator in not function", async t => {
  let Factory: ControllerFactory$;
  t.throws(function() {
    class HomeController extends Controller {
      // @ts-ignore:
      @Post("/index") user: any;
    }
    Factory = HomeController;
  });
});
