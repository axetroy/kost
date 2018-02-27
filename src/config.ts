import * as proxyServer from "http-proxy";
import * as Koa from "koa";
import * as yaml from "js-yaml";
import * as fs from "fs-extra";
import * as path from "path";
import { paths } from "./path";

export interface ProxyConfig$ extends proxyServer.ServerOptions {
  rewrite?(path: string): string;
  cookieDomainRewrite?: boolean;
  logs?: boolean;
}

export interface BodyParserConfig$ {
  enableTypes?: string[];
  encode?: string;
  formLimit?: string;
  jsonLimit?: string;
  strict?: boolean;
  detectJSON?: (ctx: Koa.Context) => boolean;
  extendTypes?: {
    json?: string[];
    form?: string[];
    text?: string[];
  };
  onerror?: (err: Error, ctx: Koa.Context) => void;
}

export interface ViewConfig$ {
  /*
    * default extension for your views
    */
  extension?: string;
  /*
    * these options will get passed to the view engine
    */
  options?: any;
  /*
    * map a file extension to an engine
    */
  map?: any;
  /*
    * replace consolidate as default engine source
    */
  engineSource?: any;
}

export type originHandler = (ctx: Koa.Request) => string;

export interface CorsConfig$ {
  origin?: string | boolean | originHandler;
  expose?: string[];
  maxAge?: number;
  credentials?: boolean;
  methods?: string[];
  headers?: string[];
}

export interface StaticFileServerConfig$ {
  mount: string;
  maxage?: number;
  hidden?: boolean;
  index?: string;
  defer?: boolean;
  gzip?: boolean;
  br?: boolean;
  setHeaders?(res: any, path: string, stats: any): any;
  extensions?: boolean;
}

export interface Config$ {
  port?: number;
  enabled?: {
    static?: boolean | StaticFileServerConfig$;
    proxy?: {
      mount: string;
      options: ProxyConfig$;
    };
    cors?: boolean | CorsConfig$;
    bodyParser?: boolean | BodyParserConfig$;
    view?: boolean | ViewConfig$;
  };
}

/**
 * load config
 */
export async function loadConfig(): Promise<any> {
  const defaultConfigPath = path.join(paths.config, "default.config.yaml");
  const envConfigPath = path.join(
    paths.config,
    process.env.NODE_ENV + ".config.yaml"
  );
  // load default config if it exist
  const defaultConfig = (await fs.pathExists(defaultConfigPath))
    ? yaml.safeLoad(await fs.readFile(defaultConfigPath, "utf8"))
    : {};

  // load env config if it exist
  const envConfig = (await fs.pathExists(envConfigPath))
    ? yaml.safeLoad(fs.readFileSync(envConfigPath, "utf8"))
    : {};

  const config: any = Object.assign(defaultConfig, envConfig);

  return config;
}
