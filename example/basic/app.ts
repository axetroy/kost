import Kost from "../../index";

const app = new Kost();

app
  .init()
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.error(err);
  });
