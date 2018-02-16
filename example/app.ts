import Application from "../index";

new Application()
  .use("logger")
  .start({
    enabled: {
      cors: true,
      static: true,
      proxy: {
        mount: "/proxy",
        options: {
          target: "http://127.0.0.1:3000",
          changeOrigin: true,
          xfwd: true,
          cookieDomainRewrite: true,
          proxyTimeout: 1000 * 120, // 2分钟为超时
          logs: true
        }
      },
      bodyParser: true,
      view: true
    }
  })
  .then(function(ctx) {})
  .catch(function(err) {
    console.error(err);
  });
