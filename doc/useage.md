# Document

* [快速开始](#quickly-start)

* [加载配置](#load-config)

* [内置特性](#build-in-feature)

  * [Http/Websocket 代理](#proxy)
  * [静态文件服务](#static-file-server)
  * [Body Parser](#body-parser)
  * [模版渲染](#view-engine)
  * [跨域资源分享](#cross-origin-resource-sharing)

* [Controller](#controller)

  * [如何编写一个控制器?](#how-to-write-a-controller)
  * [如何在控制器中使用服务?](#how-to-use-service-in-controller)
  * [如何在控制器中获取 App 上下文?](#how-to-get-app-context-in-controller)
  * [如何在控制器中使用中间件?](#how-to-use-a-middleware-in-controller)

* [Middleware](#middleware)

  * [How to write a middleware?](#how-to-write-a-middleware)
  * [How to reuse the Koa middleware?](#how-to-reuse-the-koa-middleware)
  * [How to use a middleware for global request?](#how-to-use-a-middleware-for-global-request)
  * [How to use a middleware in controller?](#how-to-use-a-middleware-in-controller)
  * [How to load middleware from npm?](#how-to-load-middleware-from-npm)

* [Service](#service)

  * [How to write a service?](#how-to-write-a-service)
  * [How to use service?](#how-to-use-service)
  * [How to inject another service?](#how-to-inject-another-service)
  * [How to init service?](#how-to-init-service)

* [Context](#context)

## 快速开始

这是示例的项目目录, 最简单的搭建一个服务

```
.
├── app.ts
├── controllers
│   └── home.controller.ts
└── tsconfig.json
```

```typescript
// app.ts
import Kost from "@axetroy/kost";

const app = new Kost();

app
  .init()
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.error(err);
  });
```

```typescript
// controllers/home.controller.ts
import { Controller, Get } from "@axetroy/kost";

export default class HomeController extends Controller {
  @Get("/")
  index(ctx) {
    ctx.body = "hello world";
  }
}
```

```bash
$ ts-node ./app.ts
```

## Load config

Kost let you load config without tear.

Support load YAML config file from `/project/configs`

it will load `default.config.yaml` fist

then load another config depending on your environment

if `process.env.NODE_ENV==='development'` (default), then load `development.config.yaml`

if `process.env.NODE_ENV==='production'` , then load `production.config.yaml`

if `process.env.NODE_ENV==='test'` , then load `test.config.yaml`

Two config file will be merger into one object.

Your can get config object from [Context](#context)

## Build in feature

### Proxy

This feature provide you proxy request to another host or path, support http/Websocket

here is an example proxy request `/proxy` to `http://127.0.0.1:3000`

```
localhost:3000/proxy > http://127.0.0.1:3000
localhost:3000/proxy/user/axetroy > http://127.0.0.1:3000/user/axetroy
```

```typescript
import Application from "@axetroy/kost";

new Application()
  .start({
    enabled: {
      proxy: {
        mount: "/proxy",
        options: {
          target: "http://127.0.0.1:3000",
          changeOrigin: true,
          xfwd: true,
          cookieDomainRewrite: true,
          proxyTimeout: 1000 * 120,
          logs: true
        }
      }
    }
  })
  .catch(function(err) {
    console.error(err);
  });
```

### Static file server

server your static file. base on [koa-static](https://github.com/koajs/static)

```typescript
import Application from "@axetroy/kost";

new Application()
  .start({
    enabled: {
      static: true // or you can pass an object, see https://github.com/koajs/static#options
    }
  })
  .catch(function(err) {
    console.error(err);
  });
```

### Body parser

enable body parser use [koa-bodyparser](https://github.com/koajs/bodyparser)

set `true` to use default config;

```typescript
import Application from "@axetroy/kost";

new Application()
  .start({
    enabled: {
      bodyParser: true // or you can pass an object, see https://github.com/koajs/bodyparser#options
    }
  })
  .catch(function(err) {
    console.error(err);
  });
```

### View engine

You need to make sure `/project/views` directory exist. all view template load from it.

base on [koa-views](https://github.com/queckezz/koa-views)

set `true` to use default config;

```typescript
import Application from "@axetroy/kost";

new Application()
  .start({
    enabled: {
      view: true // or you can pass an object, see https://github.com/queckezz/koa-views#viewsroot-opts
    }
  })
  .catch(function(err) {
    console.error(err);
  });
```

#### Cross-Origin resource sharing

support Cross-Origin resource sharing. base on [koa-cors](https://github.com/evert0n/koa-cors/)

```typescript
import Application from "@axetroy/kost";

new Application()
  .start({
    enabled: {
      cors: true // or you can pass an object, see https://github.com/evert0n/koa-cors/#options
    }
  })
  .catch(function(err) {
    console.error(err);
  });
```

## Controller

Controller is a class to controller how to organize your api.

This class will be call `new Controller` once.

use decorators `@GET()`、`@POST()`、`@PUT`... to controller api path.

use decorators `@USE` to config the middleware for this path.

use decorators `Inject()` to inject service

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

middleware is a class wrap with koa middleware.

It must implements with `pipe(ctx, next)` method

It can use in global request and specify path

It support load from `/project/middlewares/xxx.ts` and `node_modules`

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

### How to load middleware from npm?

for example, I want to load an middleware name `@axetroy/logger` which published on npm

first, you need to install it.

```bash
npm install @axetroy/logger
```

and then load it with `use()`

```typescript
// app.ts
import Kost from "@axetroy/kost";

new Kost()
  .use("@axetroy/kost-logger", {})
  .start()
  .catch(function(err) {
    console.error(err);
  });
```

### How to use a middleware in controller?

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

service is a class which can be use in controller and other service, even in middleware.

use `Inject()`, you can use in everywhere.

What different with Controller?

* [x] service is injectable class, can be inject into Controller/Service/Middleware
* [x] service's logic can be reused.
* [x] service can be init, sort by `level` property

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

You can declare the service's `level` and `async init()` to init it.

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

## Context

What's context?

context save some important information, like `start(params)` params, [config](#load-config)

Context is an injectable class, it can be inject into [Controller](#how-to-get-app-context-in-controller), Service, Middleware
