import Kost from "../../index";

const app = new Kost();

app
  .start()
  .then(function(server) {
    console.log(`Listen on ${server.address().port}`);
  })
  .catch(err => {
    console.error(err);
  });
