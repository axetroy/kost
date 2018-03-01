import test from "ava";
import * as Koa from "koa";
import Application from "./app";
import * as path from "path";
import {setCurrentWorkingDir} from "./path";
import * as request from "supertest";

test("app", async t => {
  t.deepEqual(<any>new Application() instanceof Koa, true);
});

test.serial("app start with default build-in feature", async t => {
  setCurrentWorkingDir(
    path.join(process.cwd(), "build", "__test__", "app-test-example")
  );

  const app = new Application({
    enabled: {
      cors: true,
      static: true,
      view: true,
      bodyParser: true,
      proxy: {
        mount: "/proxy",
        options: {
          target: "http://127.0.0.1:3000",
          changeOrigin: true,
          xfwd: true,
          cookieDomainRewrite: true,
          proxyTimeout: 1000 * 120,
          logs: true
        }
      }
    }
  });

  await app.start(9077);
  t.pass();
});

test.serial("app start with default build-in feature", async t => {
  setCurrentWorkingDir(
    path.join(process.cwd(), "build", "__test__", "app-test-example")
  );

  const app = new Application({
    enabled: {
      cors: true,
      static: true,
      view: true,
      bodyParser: true,
      proxy: {
        mount: "/proxy",
        options: {
          target: "http://127.0.0.1:3000",
          changeOrigin: true,
          xfwd: true,
          cookieDomainRewrite: true,
          proxyTimeout: 1000 * 120,
          logs: true
        }
      }
    }
  });

  const server = request(app.callback());

  const res: any = await new Promise((resolve, reject) => {
    server.get("/").end((err, res) => (err ? reject(err) : resolve(res)));
  });

  t.pass();
});
