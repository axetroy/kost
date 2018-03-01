import {Config$} from "../config";
import {paths, Path$} from "../path";

export interface Context$ {
  readonly env: NodeJS.ProcessEnv;
  config: any;
  options: Config$;
  paths: Path$;
}

let haveInit: boolean = false;

export default class Context implements Context$ {
  config: any = {}; // 加载的配置文件
  options: Config$ = {}; // 启动参数
  paths: Path$ = paths; // 相关的路径信息
  constructor() {
    if (haveInit) {
      throw new Error(
        "The context have been init, please inject instead of new Context()"
      );
    } else {
      haveInit = true;
    }
  }

  get env(): NodeJS.ProcessEnv {
    return process.env;
  }
}
