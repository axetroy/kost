import test from "ava";
import { Inject, Container } from "typedi";
import * as path from "path";
import { GET } from "./decorators/http";
import Service, { ServiceFactory$ } from "./service";

const originCwd = process.cwd();

test("service", async t => {
  let serviceFactory: ServiceFactory$;
  t.notThrows(function() {
    class MyService extends Service {
      enable = true;
      level = 0;
      async init() {}
    }
    serviceFactory = MyService;
  });
  const service = Container.get(serviceFactory);

  // default property
  t.deepEqual(service.level, 0);
  t.deepEqual(service.enable, true);
});

test("service inject service", async t => {
  class A extends Service {}
  class B extends Service {
    @Inject() a: A;
  }
  const service = Container.get(B);

  t.true(service.a instanceof A);
  t.true(service instanceof B);
});
