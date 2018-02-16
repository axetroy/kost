## Document

- [Controller](#controller)
- [Middleware](#middleware)
- [Service](#service)

### Middleware

#### How to write a middleware?

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

#### How to reuse the Koa middleware?

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

#### How to use a middleware for global request?

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

#### How to use a middleware for in controller?

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

### Controller

#### How to write a controller

#### How to use service in controller

#### How to get app context in controller

### How to write a service

#### How to use service

#### How to inject another service