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
          target: "http://localhost:3000",
          changeOrigin: true,
          xfwd: true,
          cookieDomainRewrite: true,
          proxyTimeout: 1000 * 120,
          logs: true
        }
      }
    }
  });

  const server = await app.start(9077);
  server.close();
  t.pass();
});

test("app start with default build-in feature", async t => {
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
          target: "http://www.baidu.com",
          changeOrigin: true,
          xfwd: true,
          cookieDomainRewrite: true,
          proxyTimeout: 1000 * 120,
          logs: true
        }
      }
    }
  });

  await (<any>app).init();

  const server = request(app.callback());

  const res: any = await new Promise((resolve, reject) => {
    server.get("/").end((err, res) => (err ? reject(err) : resolve(res)));
  });

  t.deepEqual(res.text, "hello world");

  // request view
  const res2: any = await new Promise((resolve, reject) => {
    server.get("/view").end((err, res) => (err ? reject(err) : resolve(res)));
  });

  t.deepEqual(
    res2.text,
    `<div>
  hello view
</div>`
  );

  t.deepEqual(res2.header["access-control-allow-origin"], "*");
  t.deepEqual(
    res2.header["access-control-allow-methods"],
    "GET,HEAD,PUT,POST,DELETE"
  );
  t.deepEqual(res2.header["content-type"], "text/html; charset=utf-8");

  // test static
  const res3: any = await new Promise((resolve, reject) => {
    server
      .get("/static/test.text")
      .end((err, res) => (err ? reject(err) : resolve(res)));
  });

  t.deepEqual(res3.statusCode, 200);

  t.deepEqual(res3.text, "hello static text");

  // test proxy
  console.log("请求代理");
  const res4: any = await new Promise((resolve, reject) => {
    server
      .get("/proxy/static/test.text")
      .end((err, res) => (err ? reject(err) : resolve(res)));
  });

  console.log("代理返回结果了");

  t.deepEqual(res4.statusCode, 302);

  t.deepEqual(
    res4.header["location"],
    "http://www.baidu.com/search/error.html"
  );
});

test("app start with custom view build-in feature", async t => {
  setCurrentWorkingDir(
    path.join(process.cwd(), "build", "__test__", "app-test-example")
  );

  const app = new Application({
    enabled: {
      view: {
        extension: ".html"
      }
    }
  });

  await (<any>app).init();

  const server = request(app.callback());

  // request view
  const res: any = await new Promise((resolve, reject) => {
    server.get("/view").end((err, res) => (err ? reject(err) : resolve(res)));
  });

  t.deepEqual(
    res.text,
    `<div>
  hello view
</div>`
  );
});

test("app start with custom cors build-in feature", async t => {
  setCurrentWorkingDir(
    path.join(process.cwd(), "build", "__test__", "app-test-example")
  );

  const app = new Application({
    enabled: {
      cors: {
        methods: ["GET"]
      }
    }
  });

  await (<any>app).init();

  const server = request(app.callback());

  // request view
  const res: any = await new Promise((resolve, reject) => {
    server.get("/").end((err, res) => (err ? reject(err) : resolve(res)));
  });

  t.deepEqual(res.text, "hello world");
  t.deepEqual(res.header["access-control-allow-methods"], "GET");
});

test("app start with custom body parser build-in feature", async t => {
  setCurrentWorkingDir(
    path.join(process.cwd(), "build", "__test__", "app-test-example")
  );

  const app = new Application({
    enabled: {
      bodyParser: {}
    }
  });

  await (<any>app).init();

  const server = request(app.callback());

  // request view
  const res: any = await new Promise((resolve, reject) => {
    server.get("/").end((err, res) => (err ? reject(err) : resolve(res)));
  });

  t.deepEqual(res.text, "hello world");
});

test("app start with custom static file build-in feature", async t => {
  setCurrentWorkingDir(
    path.join(process.cwd(), "build", "__test__", "app-test-example")
  );

  const app = new Application({
    enabled: {
      static: {
        mount: "/public"
      }
    }
  });

  await (<any>app).init();

  const server = request(app.callback());

  const res: any = await new Promise((resolve, reject) => {
    server
      .get("/public/test.text")
      .end((err, res) => (err ? reject(err) : resolve(res)));
  });

  t.deepEqual(res.statusCode, 200);

  t.deepEqual(res.text, "hello static text");
});
