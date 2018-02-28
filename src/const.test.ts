import test from "ava";
import * as constant from "./const";

test("every output should be symbol", async t => {
  for (let attr in constant) {
    let val = constant[attr];
    t.deepEqual(typeof val, "symbol");
  }
});
