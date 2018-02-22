/// <reference types="node" />
import { Config$ } from "./config";
import { Path$ } from "./path";
export interface Context$ {
    readonly env: NodeJS.ProcessEnv;
    config: any;
    params: Config$;
    paths: Path$;
}
export default class Context implements Context$ {
    config: any;
    params: Config$;
    paths: Path$;
    constructor();
    readonly env: NodeJS.ProcessEnv;
}
