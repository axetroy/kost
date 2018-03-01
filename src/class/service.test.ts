import "reflect-metadata";
import test from "ava";
import {Inject, Container} from "typedi";
import * as path from "path";
import Service, {ServiceFactory$, loadService} from "./service";
import {setCurrentWorkingDir} from "../path";
import UserService from "../../__test__/service-test-example/services/user.service.js";
import LogService from "../../__test__/service-test-example/services/log.service.js";

test("service", async t => {
  let serviceFactory: ServiceFactory$;
  t.notThrows(function () {
    class MyService extends Service {
      enable = true;
      level = 0;

      async init() {
      }
    }

    serviceFactory = MyService;
  });
  const service = Container.get(serviceFactory);

  // default property
  t.deepEqual(service.level, 0);
  t.deepEqual(service.enable, true);
});

test("service inject service", async t => {
  class A extends Service {
  }

  class B extends Service {
    @Inject() a: A;
  }

  const service = Container.get(B);

  t.true(service.a instanceof A);
  t.true(service instanceof B);
});

test("Inject service", async t => {
  class A extends Service {
  }

  class B extends Service {
    @Inject() a: A;
  }

  const service = Container.get(B);

  t.true(service.a instanceof A);
  t.true(service instanceof B);
});

test.serial("Load service", async t => {
  setCurrentWorkingDir(
    path.join(process.cwd(), "build", "__test__", "service-test-example")
  );

  await loadService();

  // service have been init here

  const user = Container.get(UserService);
  const logger = Container.get(LogService);

  t.deepEqual(user.username, "admin");

  t.deepEqual(await user.getUser(), {name: "Axetroy"});

  // logger service should be inited before user service
  t.true(logger.initedAt.getTime() < user.initedAt.getTime());
});

test.serial("Load invalid service", async t => {
  setCurrentWorkingDir(
    path.join(
      process.cwd(),
      "build",
      "__test__",
      "invalid-service-test-example"
    )
  );

  try {
    await loadService();
    t.fail("It should throw an error");
  } catch (err) {
    t.true(err instanceof Error);
  }
});
