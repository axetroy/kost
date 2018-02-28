import test from "ava";
import { ROUTER, MIDDLEWARE } from "./const";

test("const", async t => {
  t.deepEqual(typeof ROUTER, "symbol");
  t.deepEqual(typeof MIDDLEWARE, "symbol");
});
