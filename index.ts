import { Inject } from "typedi";

import App from "./src/app";
import Controller from "./src/controller";
import Service from "./src/service";
import { GET, POST, PUT, DELETE } from "./src/http";

export default App;

export { Controller, Service, GET, POST, PUT, DELETE, Inject };
