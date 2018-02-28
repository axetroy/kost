import test from "ava";
import * as path from "path";
import Kost from "./index";
import * as request from "supertest";
import { paths, setCurrentWorkingDir } from "./src/path";

test("index", async t => {
  // default mode
  t.deepEqual(process.env.NODE_ENV, "test");
});

test("basic", async t => {
  setCurrentWorkingDir(
    path.join(process.cwd(), "build", "__test__", "controller-test-example")
  );

  const app = await new Kost().init();

  const server = request(app.callback());

  const res1: any = await new Promise((resolve, reject) => {
    server.get("/").end((err, res) => (err ? reject(err) : resolve(res)));
  });

  t.deepEqual(res1.text, "hello world");

  const res2: any = await new Promise((resolve, reject) => {
    server.get("/name").end((err, res) => (err ? reject(err) : resolve(res)));
  });

  t.deepEqual(res2.text, "axetroy");
});

test("invalid middleware", async t => {
  let app;
  t.notThrows(function() {
    // hello.middleware.ts is not exist at all
    // even thought, before it start, it will not throw;
    app = new Kost().use("hello");
  });

  // when init, it should throw error
  try {
    await app.init();
  } catch (err) {
    t.true(err instanceof Error);
  }
});
