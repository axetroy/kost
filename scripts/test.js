/**
 * Created by axetroy on 2017/7/23.
 */
const path = require("path");
const glob = require("glob");
const fs = require("fs-extra");

const asset = {
  ".json": true,
  ".yaml": true,
  ".yml": true,
  ".html": true,
  ".hbs": true,
  ".text": true
};

glob("__test__/**/**/*", function(err, files) {
  if (err) throw err;
  while (files.length) {
    const file = files.shift();
    const f = path.parse(file);

    if (file.indexOf("node_modules") >= 0) {
      return;
    }

    if (asset[f.ext]) {
      const distFile = file.replace(/^__test__/, "build/__test__");
      fs.copy(file, distFile).catch(err => {
        console.error(err);
      });
    }
  }
});
