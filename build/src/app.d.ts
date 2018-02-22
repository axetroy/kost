/// <reference types="node" />
import "reflect-metadata";
import { Server } from "http";
import { Config$ } from "./config";
export interface Application$ {
    start(config: Config$): Promise<Server>;
}
declare class Application implements Application$ {
    private app;
    start(startOptions?: Config$): Promise<Server>;
    use(middlewareName: string, options?: {}): this;
}
export default Application;
