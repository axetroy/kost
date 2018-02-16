# Document

* [Controller](#controller)
  * [How to write a controller?](#how-to-write-a-controller)
  * [How to use service in controller?](#how-to-use-service-in-controller)
  * [How to get app context in controller?](#how-to-get-app-context-in-controller)
* [Middleware](#middleware)
  * [How to write a middleware?](#how-to-write-a-middleware)
  * [How to reuse the Koa middleware?](#how-to-reuse-the-koa-middleware)
  * [How to use a middleware for global request?](#how-to-use-a-middleware-for-global-request)
  * [How to use a middleware for in controller?](#how-to-use-a-middleware-for-in-controller)
* [Service](#service)
  - [How to write a service?](#how-to-write-a-service)
  - [How to use service?](#how-to-use-service)
  - [How to inject another service?](#how-to-inject-another-service)
  - [How to init service?](#how-to-init-service)

## Controller

Controller is a class to controller how to organize your api.

This class will be call ``new Controller`` once.

use decorators ``@GET()``、``@POST()``、``@PUT``... to controller api path.

use decorators ``@USE`` to config the middleware for this path.

use decorators ``Inject()`` to inject service

### How to write a controller?

Create a controller file in `/project/controllers`

example: `/project/controllers/user.ts`

```typescript
// /project/controllers/user.ts

import { Controller, GET, POST, DELETE } from "@axetroy/kost";

class UserController extends Controller {
  @GET("/")
  async index(ctx, next) {
    ctx.body = "hello kost";
  }
  @POST("/login")
  async login(ctx, next) {
    ctx.body = "login success";
  }
  @DELETE("/logout")
  async logout(ctx, next) {
    ctx.body = "logout success";
  }
}

export default UserController;
```

### How to use service in controller?

If you have define a service in `/project/services/user.ts`

```typescript
import { Service } from "@axetroy/kost";

class UserService extends Service {
  async getUser(username: string) {
    return {
      name: username,
      age: 21,
      address: "unknown"
    };
  }
}

export default UserService;
```

```typescript
// /project/controllers/user.ts

import { Controller, GET, Inject } from "@axetroy/kost";
import UserService from "../services/user";

class UserController extends Controller {
  @Inject() user: UserService;
  @GET("/:username")
  async getUserInfo(ctx, next) {
    const userInfo = await this.user.getUserInfo(ctx.params.username);
    ctx.body = userInfo;
  }
}

export default UserController;
```

### How to get app context in controller?

The app context include some useful information

* [x] The project config
* [x] The bootstrap params(argument for start)

```typescript
// /project/controllers/user.ts

import { Controller, GET, Inject, Context } from "@axetroy/kost";

class UserController extends Controller {
  @Inject() context: Context;
  @GET("/context")
  async getTheAppContext(ctx, next) {
    ctx.body = this.context;
  }
}

export default UserController;
```

## Middleware

### How to write a middleware?

Create a middle file in `/project/middlewares`

example: `/project/middlewares/logger.ts`

```typescript
// /project/middlewares/logger.ts

import { Middleware } from "@axetroy/kost";
export default class extends Middleware {
  async pipe(ctx, next) {
    const before = new Date().getTime();
    await next();
    const after = new Date().getTime();
    const take = after - before;
    console.log(`[${ctx.req.method}]: ${ctx.req.url} ${take}ms`);
  }
}
```

### How to reuse the Koa middleware?

If I want to use a Koa middleware, like [koa-cors](https://github.com/evert0n/koa-cors)

Create a middle file in `/project/middlewares/cors`

```typescript
// /project/middlewares/cors.ts

import { Middleware } from "@axetroy/kost";
import * as cors from "koa-cors";
export default class extends Middleware {
  async pipe(ctx, next) {
    return cors({
      origin: "*"
    });
  }
}
```

### How to use a middleware for global request?

If you have create a middleware([How to write a middleware?](#how-to-write-a-middleware))

then you should start your app with `app.use(middlewareName, options)`

```typescript
// app.ts
import Kost from "@axetroy/kost";

new Kost()
  .use("logger", {})
  .use("another middleware", {})
  .start()
  .catch(function(err) {
    console.error(err);
  });
```

### How to use a middleware for in controller?

Here is a controller

```typescript
// /project/controllers/user.ts

import { Controller, GET, USE } from "@axetroy/kost";

class UserController extends Controller {
  @GET("/")
  @USE("logger", {})
  async index(ctx, next) {
    ctx.body = "hello kost";
  }
}

export default UserController;
```

## Service

### How to write a service?

Create a controller file in `/project/services`

example: `/project/services/user.ts`

```typescript
import { Service } from "@axetroy/kost";

class UserService extends Service {
  async getUser(username: string) {
    return {
      name: username,
      age: 21,
      address: "unknown"
    };
  }
}

export default UserService;
```

### How to use service?

There a three way to use service

1. Inject into controller
2. Inject into another service
3. Inject into middleware

Here is an example to use in controller

```typescript
// /project/controllers/user.ts

import { Controller, GET, Inject } from "@axetroy/kost";
import UserService from "../services/user";

class UserController extends Controller {
  @Inject() user: UserService;
  @GET("/:username")
  async getUserInfo(ctx, next) {
    const userInfo = await this.user.getUserInfo(ctx.params.username);
    ctx.body = userInfo;
  }
}

export default UserController;
```

### How to inject another service?

### How to init service?

You can declare the service's level to init it.

for example, we got 2 service to init.

* /project/services/orm.ts
* /project/services/initUser.ts

If we want init `orm.ts` first then init `initUser.ts`

You can define you service's level

```typescript
import { Service } from "@axetroy/kost";

class OrmService extends Service {
  level: 100; // set the level for this service, default: 0
  async init() {
    // create an connection for database
  }
  async query(sql: string) {
    // do something job
  }
}

export default OrmService;
```

```typescript
import { Service } from "@axetroy/kost";

class InitUserService extends Service {
  level: 99; // set the level for this service, default: 0
  async init() {
    // create user if doest not exist
  }
  async createUser(sql: string) {
    // do something job
  }
}

export default InitUserService;
```
