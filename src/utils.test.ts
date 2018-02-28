import test from "ava";
import * as path from "path";
import { getOutput } from "./utils";

test("get output", async t => {
  t.deepEqual(
    getOutput({
      default: 123
    }),
    123
  );

  t.deepEqual(getOutput([]), []);
  t.deepEqual(getOutput(undefined), undefined);
});
