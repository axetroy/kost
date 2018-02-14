import { Inject } from "typedi";

import App from "./src/app";
import Controller from "./src/controller";
import Middleware from "./src/middleware";
import Service from "./src/service";
import { GET, POST, PUT, DELETE, HEAD, PATCH } from "./src/http";

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
  PATCH
};
