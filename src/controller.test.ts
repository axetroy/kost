import test from "ava";

import * as path from "path";
import { Get } from "./decorators/http";
import Controller, { ControllerFactory$, loadController } from "./controller";
import { ROUTER } from "./const";
import { setCurrentWorkingDir, paths } from "./path";
import * as request from "supertest";
import * as Koa from "koa";

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

test("load controller", async t => {
  setCurrentWorkingDir(
    path.join(paths.cwd, "build", "__test__", "controller-test-example")
  );
  const router = await loadController();

  const stack = router.stack;
  t.deepEqual(stack[0].path, "/");
  t.deepEqual(stack[1].path, "/name");

  const app = new Koa();

  app.use(router.routes()).use(router.allowedMethods());

  const server = request(app.callback());

  const res1: any = await new Promise(function(resolve, reject) {
    server.get("/").end((err, res) => (err ? reject(err) : resolve(res)));
  });

  t.deepEqual(res1.text, "hello world");

  const res2: any = await new Promise(function(resolve, reject) {
    server.get("/name").end((err, res) => (err ? reject(err) : resolve(res)));
  });

  t.deepEqual(res2.text, "axetroy");
});
