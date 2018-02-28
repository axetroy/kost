import test from "ava";
import * as Koa from "koa";
import Application from "./app";

test("app", async t => {
  t.deepEqual(<any>new Application() instanceof Koa, true);
});
