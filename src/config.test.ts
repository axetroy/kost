import test from "ava";
import * as path from "path";
import { loadConfig } from "./config";
import { paths, setCurrentWorkingDir } from "./path";

test("load config", async t => {
  const cwd = path.join(__dirname, "..", "example");
  setCurrentWorkingDir(cwd);

  const config = await loadConfig();

  t.true(typeof config === "object");
});
