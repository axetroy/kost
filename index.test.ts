import test from "ava";
const { Controller } = require("./index");

test("index", async t => {
  // default mode
  t.deepEqual(process.env.NODE_ENV, "test");
});
