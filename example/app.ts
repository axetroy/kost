import App from "../index";

new App()
  .start({
    cluster: 4
  })
  .then(function(ctx){

  })
  .catch(function(err) {
    console.error(err);
  });
