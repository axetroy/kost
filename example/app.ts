import App from "../index";

new App()
  .use("logger")
  .start({
    cluster: 4,
    enabled: {
      static: {
        mount: "/public"
      },
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
      }
    }
  })
  .then(function(ctx) {})
  .catch(function(err) {
    console.error(err);
  });
