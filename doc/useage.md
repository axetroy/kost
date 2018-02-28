# Document

* [快速开始](#快速开始)

* [一系列规范和约定](#一系列规范和约定)

  * [文件目录](#文件目录)
  * [Config](#config-约定)
  * [Controller](#controller-约定)
  * [Service](#service-约定)
  * [Middleware](#middleware-约定)

* [加载配置](#加载配置)

* [内置特性](#build-in-feature)

  * [Http/Websocket 代理](#代理)
  * [静态文件服务](#静态文件服务)
  * [Body Parser](#body-parser)
  * [模版渲染](#模版渲染)
  * [跨域资源分享](#跨域资源分享)

* [Controller](#controller)

  * [如何编写一个 Controller?](#如何编写一个-controller)
  * [如何在 Controller 中使用 Service?](#如何在-controller-中使用-service)
  * [如何在 Controller 中获取框架的上下文 Context?](#如何在-controller-中获取框架的上下文-context)

* [Middleware](#middleware)

  * [如何编写一个 Middleware?](#如何编写一个-middleware)
  * [如何复用或兼容 Koa 的中间件?](#如何复用或兼容-koa-的中间件)
  * [中间件怎么运用到全局请求?](#中间件怎么运用到全局请求)
  * [如何针对某个 API 使用 Middleware?](#如何针对某个-api-使用-middleware)

* [Service](#service)

  * [如何编写一个 Service?](#如何编写一个-service)
  * [如何使用 Service?](#如何使用-service)
  * [如何初始化服务?](#如何初始化服务)

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
  .start()
  .then(function(server) {
    console.log(`Listen on ${server.address().port}`);
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

## 一系列规范和约定

框架的正常运行，依赖与一系列的规范和预定

其中包括:

### 文件目录

约定几个固定的文件目录

* configs: 存放配置文件
* controllers: 存放控制器
* services: 存放服务
* middlewares: 存放中间件
* static: 存放静态文件
* views: 存放视图模板

### Config 约定

控制器约定要放在`项目目录/configs`下，并且以为`xx.config.yaml`命名, 目前仅支持 yaml 文件作为配置，不支持 json

各配置文件中的字段，应该一致

### Controller 约定

控制器约定要放在`项目目录/controllers`下，并且以为`xx.controller.ts`命名

控制器文件暴露一个继承自 Controller 的类

### Service 约定

控制器约定要放在`项目目录/services`下，并且以为`xx.service.ts`命名

控制器文件暴露一个继承自 Service 的类

可以通过定义`async init()`来初始化 service

定义`level`属性来排序服务之间的初始化顺序

### Middleware 约定

中间件约定要放在`项目目录/middlewares`下，并且以为`xx.middleware.ts`命名

控制器文件暴露一个继承自 Middleware 的类，并且必须实现`async pipe(ctx, next)`方法

## 加载配置

框架根据环境变量`NODE_ENV`，自动加载 yaml 配置文件

配置文件必须放在`/configs`目录下，例如`/configs/development.config.yaml`

默认会加载`default.config.yaml`

然后会与`${process.env.NODE_ENV}.config.yaml`的配置文件合并在一起

你可以通过[Context](#context)获取配置文件

## 内置特性

### 代理

内置了[koa-proxies](https://github.com/vagusX/koa-proxies)该特性提供代理 http 或 Websocket，做到请求转发。

下面一个例子是代理`{host}/proxy` 到 `http://127.0.0.1:3000`

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

### 静态文件服务

内置了[koa-static](https://github.com/koajs/static) 提供静态文件服务

默认提供的 url 路径为`{host}/static`

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

### Body Parser

内置了[koa-bodyparser](https://github.com/koajs/bodyparser), 用于解析请求的 Http Body

设置 `true` 则使用默认配置

```typescript
import Application from "@axetroy/kost";

new Application()
  .start({
    enabled: {
      bodyParser: true // 或者你可以传入一个对象, 详情 https://github.com/koajs/bodyparser#options
    }
  })
  .catch(function(err) {
    console.error(err);
  });
```

### 模版渲染

首先确保 `/views` 目录存在， 所有的模版都应该存放在这里目录下.

内置了[koa-views](https://github.com/queckezz/koa-views)，提供模版引擎

设置 `true` 则使用默认配置

```typescript
import Application from "@axetroy/kost";

new Application()
  .start({
    enabled: {
      view: true // 或者你可以传入一个对象, 详情 https://github.com/queckezz/koa-views#viewsroot-opts
    }
  })
  .catch(function(err) {
    console.error(err);
  });
```

#### 跨域资源分享

内置了[koa-cors](https://github.com/evert0n/koa-cors/)提供跨域资源的分享

设置 `true` 则使用默认配置

```typescript
import Application from "@axetroy/kost";

new Application()
  .start({
    enabled: {
      cors: true // 或者你可以传入一个对象, 详情 https://github.com/evert0n/koa-cors/#options
    }
  })
  .catch(function(err) {
    console.error(err);
  });
```

## Controller

Controller 是一个类，在框架初始化时自动实例化，它定义了你如何组织你的 API。

在控制器上，你可以使用`@Get()`、`@Post()`、`@Put()`等装饰器来定义你的路由

也可以使用`@Use()`来指定某个 API 加载指定的中间件

也可以使用`@Inject()`来注入服务

### 如何编写一个 Controller?

框架规定控制器必须在`/controllers`目录下。并且命名为`xxx.controller.ts`

下面是一个例子

```typescript
// controllers/user.ts

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

### 如何在 Controller 中使用 Service?

假设你已经定义了一个服务

```typescript
// services/user.service.ts
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

那么你需要这么使用, 通过装饰器 `@Inject()` 注入你所需要的服务

```typescript
// controllers/user.ts

import { Controller, GET, Inject } from "@axetroy/kost";
import UserService from "../services/user.service";

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

### 如何在 Controller 中获取框架的上下文 Context?

框架的上下文包括了一些非常有用的信息

* [x] 项目的配置
* [x] 框架的启动参数

与注入服务一样，使用 `@Inject()` 注入[Context](#context)

```typescript
// controllers/user.controller.ts

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

Middleware 是 Koa 中间件的一层 OOP 的封装

它要求你必须实现`pipe(ctx, next)`方法

中间件可用于全局，或者某个局部的 API，它支持从`middlewares/xxx.middleware.ts`中加载，也支持从`node_modules`中加载

优先级: 本地 > npm

### 如何编写一个 Middleware?

框架规定中间件必须在`/middlewares`目录下。并且命名为`xxx.middleware.ts`

下面是一个例子

```typescript
// middlewares/logger.middleware.ts

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

### 如何复用或兼容 Koa 的中间件?

如果你想直接使用 Koa 的中间件, 例如 [koa-cors](https://github.com/evert0n/koa-cors)

在项目目录下，创建一个文件 `middlewares/cors.middleware.ts`

```typescript
// /middlewares/cors.middleware.ts

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

### 中间件怎么运用到全局请求?

加入你已经创建了一个中间件`middlewares/logger.middleware.ts`

你可以这么使用

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

**NOTE**: `use()`方法同样兼容 Koa 中间件，并且支持从`node_modules`中加载

### 如何针对某个 API 使用 Middleware?

下面是一个例子，通过使用`@Use()`装饰器，指定某个 API 的中间件

```typescript
// /project/controllers/user.ts

import { Controller, Get, Use } from "@axetroy/kost";

class UserController extends Controller {
  @Get("/")
  @Use("logger", {})
  async index(ctx, next) {
    ctx.body = "hello kost";
  }
}

export default UserController;
```

## Service

服务是一个类，能够被注入到 Controller 当中，甚至可以注入到其他的 Service，也能够注入到 Middleware 中

使用`@Inject()`装饰器，你能够注入到任何你需要的地方

它跟 Controller 有什么区别?

* [x] Service 是一个可注入的类, 你可以注入到 Controller/Service/Middleware
* [x] Service 的逻辑是可以公用的，而 Controller 不能公用.
* [x] Service 可以被初始化, 按照`level`属性进行排序，level 越高，优先级越高

### 如何编写一个 Service?

框架规定中间件必须在`/services`目录下。并且命名为`xxx.service.ts`

下面是一个例子

```typescript
// services/user.service.ts
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

### 如何使用 Service?

服务可以通过下列方式使用：

1. 注入到 Controller
2. 注入到其他 Service
3. 注入到 Middleware

下面这个例子展示了如何在 Controller 中使用

```typescript
// controllers/user.ts

import { Controller, Get, Inject } from "@axetroy/kost";
import UserService from "../services/user";

class UserController extends Controller {
  @Inject() user: UserService;
  @Get("/:username")
  async getUserInfo(ctx, next) {
    const userInfo = await this.user.getUserInfo(ctx.params.username);
    ctx.body = userInfo;
  }
}

export default UserController;
```

### 如何初始化服务?

有一些服务，在使用前，需要做异步的初始化动作

你可以声明 Service 的`level`属性和`async init()`方法来初始化

例如，我们又下列两个方法来初始化

* /project/services/orm.service.ts
* /project/services/user.service.ts

如果你想先初始化`orm.service.ts`再初始化`user.service.ts`

你可以这样定义 Service 的`level`

```typescript
// services/orm.service.ts
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
// services/user.service.ts
import { Service } from "@axetroy/kost";

class UserService extends Service {
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

什么是 Context?

Context 是框架的执行上下文，其中包含了重要的信息, 包括[配置](#配置加载), 包括启动参数.

Context 是一个可注入的类，它可以注入到任何地方，包括 Controller/Service/Middleware

Context 不需要你实例化，手动实例化会引发错误
