import test from "ava";
import { paths } from "./path";

test("paths", async t => {
  t.deepEqual(paths.cwd, process.cwd());
  t.true(typeof paths.config === "string");
  t.true(typeof paths.controller === "string");
  t.true(typeof paths.middleware === "string");
  t.true(typeof paths.service === "string");
  t.true(typeof paths.static === "string");
  t.true(typeof paths.view === "string");
});
