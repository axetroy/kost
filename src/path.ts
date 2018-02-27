import * as path from "path";

export interface Path$ {
  cwd: string;
  controller: string;
  config: string;
  middleware: string;
  service: string;
  static: string;
  view: string;
}

let paths: Path$;

/**
 * set current working dir
 * @param cwd
 */
export function setCurrentWorkingDir(cwd: string): void {
  paths = paths || <any>{};
  paths.cwd = cwd;
  paths.config = path.join(cwd, "configs");
  paths.controller = path.join(cwd, "controllers");
  paths.middleware = path.join(cwd, "middlewares");
  paths.service = path.join(cwd, "services");
  paths.static = path.join(cwd, "static");
  paths.view = path.join(cwd, "views");
}

setCurrentWorkingDir(process.cwd());

export { paths };
