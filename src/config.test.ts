import test from "ava";
import * as path from "path";
import { loadConfig } from "./config";
import { paths, setCurrentWorkingDir } from "./path";

test.serial("load none config", async t => {
  const cwd = path.join(process.cwd(), "__test__", "config-none-test-example");
  setCurrentWorkingDir(cwd);

  const config = await loadConfig();

  t.true(typeof config === "object");
  t.deepEqual(Object.keys(config).length, 0);
});

test.serial("load default config", async t => {
  const cwd = path.join(
    process.cwd(),
    "__test__",
    "config-default-test-example"
  );
  setCurrentWorkingDir(cwd);

  const config = await loadConfig();

  t.true(typeof config === "object");
  t.deepEqual(config.name, "axetroy");
  t.deepEqual(Object.keys(config).length, 1);
});

test.serial("load default config and env config", async t => {
  const cwd = path.join(process.cwd(), "__test__", "config-all-test-example");
  setCurrentWorkingDir(cwd);

  const config = await loadConfig();

  t.true(typeof config === "object");
  t.deepEqual(config.env, "test");
  t.deepEqual(Object.keys(config).length, 2);
});
