import { Inject } from "typedi";

import App from "./src/app";
import Controller from "./src/controller";
import Middleware from "./src/middleware";
import Service from "./src/service";
import { GET, POST, PUT, DELETE, HEAD, PATCH, USE } from "./src/decorators";

export default App;

export {
  Controller,
  Service,
  Middleware,
  Inject,
  GET,
  POST,
  PUT,
  DELETE,
  HEAD,
  PATCH,
  USE
};
