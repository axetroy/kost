import { Container } from "typedi";
import test from "ava";
import Context from "./context";
import { paths } from "./path";

test("every output should be symbol", async t => {
  // const context = Container.get(Context);
  const context = new Context();
  t.throws(() => {
    new Context();
  });

  t.deepEqual(context.env, process.env);
  t.deepEqual(context.config, {}); // default config
  t.deepEqual(context.options, {}); //default options
  t.deepEqual(context.paths, paths); //default params
});
