process.env.NODE_ENV = process.env.NODE_ENV || "development";

import { Inject } from "typedi";

import Application from "./src/app";
import Controller from "./src/class/controller";
import Middleware from "./src/class/middleware";
import Service from "./src/class/service";
import Context from "./src/class/context";
export * from "./src/decorators";

export default Application;

export { Controller, Service, Middleware, Context, Inject };
