process.env.NODE_ENV = process.env.NODE_ENV || "development";

import { Inject } from "typedi";

import Application from "./src/app";
import Controller from "./src/controller";
import Middleware from "./src/middleware";
import Service from "./src/service";
import Context from "./src/context";
import { GET, POST, PUT, DELETE, HEAD, PATCH, USE } from "./src/decorators";

export default Application;

export {
  Controller,
  Service,
  Middleware,
  Context,
  Inject,
  GET,
  POST,
  PUT,
  DELETE,
  HEAD,
  PATCH,
  USE
};
