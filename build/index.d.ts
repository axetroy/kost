import { Inject } from "typedi";
import Application from "./src/app";
import Controller from "./src/controller";
import Middleware from "./src/middleware";
import Service from "./src/service";
import Context from "./src/context";
export * from "./src/decorators";
export default Application;
export { Controller, Service, Middleware, Context, Inject };
