import * as path from "path";

interface Path$ {
  cwd: string;
  controller: string;
  config: string;
  middleware: string;
  service: string;
  static: string;
  view: string;
}

const cwd = process.cwd();

const paths: Path$ = {
  cwd,
  controller: path.join(cwd, "controllers"),
  config: path.join(cwd, "configs"),
  middleware: path.join(cwd, "middlewares"),
  service: path.join(cwd, "services"),
  static: path.join(cwd, "static"),
  view: path.join(cwd, "views")
};

export { paths };
