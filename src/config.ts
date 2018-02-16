import * as proxyServer from "http-proxy";
import * as Koa from "koa";

interface ProxyConfig$ extends proxyServer.ServerOptions {
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

type originHandler = (ctx: Koa.Request) => string;

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
