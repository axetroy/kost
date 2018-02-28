## Kost

[![Greenkeeper badge](https://badges.greenkeeper.io/axetroy/kost.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/axetroy/kost.svg?branch=master)](https://travis-ci.org/axetroy/kost)
[![Coverage Status](https://coveralls.io/repos/github/axetroy/kost/badge.svg?branch=master)](https://coveralls.io/github/axetroy/kost?branch=master)
[![Dependency](https://david-dm.org/axetroy/kost.svg)](https://david-dm.org/axetroy/kost)
![License](https://img.shields.io/badge/license-MIT-green.svg)
[![Prettier](https://img.shields.io/badge/Code%20Style-Prettier-green.svg)](https://github.com/prettier/prettier)
![Node](https://img.shields.io/badge/node-%3E=8.9-blue.svg?style=flat-square)
[![npm version](https://badge.fury.io/js/%40axetroy%2Fkost.svg)](https://badge.fury.io/js/%40axetroy%2Fkost)
![Size](https://github-size-badge.herokuapp.com/axetroy/kost.svg)

Kost 基于 Koa，使用 Typescript 编写，借鉴于 egg 的**约定大于配置**的思想以及 nest 的依赖注入和装饰器路由。

是一款内置多个功能，并遵循一系列规范的 Web 框架

**特性**

* [x] 依赖注入
* [x] 使用 Typescript 编写
* [x] 装饰器风格的路由定义
* [x] 支持中间件，包括 Koa 的中间件
* [x] 引入服务的概念
* [x] 支持加载不同环境下的配置文件
* [x] 兼容 Koa 中间件

**内置特性**

* [x] Http/Websocket 的代理
* [x] 静态文件服务
* [x] 解析 Http Body
* [x] 视图引擎
* [x] 跨域资源分享
* [ ] 错误捕捉
* [ ] 定时任务

### 框架架构

![kost](https://raw.githubusercontent.com/axetroy/kost/master/kost.png)

### 快速开始

```bash
npm install @axetroy/kost --save
```

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

## [文档](https://github.com/axetroy/kost/blob/master/doc/useage.md)

## Q & A

Q: 为什么开发这样的框架

> A: 框架基于以前的项目经验沉淀而来，首先是坚持 Typescript 不动摇，能在开发阶段避免了很多 bug。

Q: 为什么不使用 nest？

> A: 因为它是基于 Express，而我以前的项目都是 Typescript + Koa

Q: 为什么不使用 egg?

> A: egg 使用 JS 开发，目前对 Typescript 没有一个很好的方案(见识短，没发现)，而且 egg 的 service 会丢失类型 IDE 提示，目前 egg 成员已在着手解决这个问题，期待中...

Q: 与两者的框架区别在哪里?

> A: 借鉴了 egg 的约定大于配置的思想，约定了一些文件目录，文件名，如果不按照框架写，就会 boom。借鉴了 nest 的 OOP 编程思想，所有的，包括 Controller、Service、Middleware 都是类，都可以进行依赖注入，而且路由定义是装饰器风格，语法糖会让你更加的直观。对于开发而言，会有很好的 IDE 提示。

Q: 框架内置了一些特性，会不会平白增加性能负担？

> A: 根据你是否开启特性，来决定是否引入包，所以不会有性能损耗。

Q: 是否需要配套 CLI 工具?

> A: 目前没有，编译成 JS 就能运行，可以用 pm2 进行负载均衡。

Q: 框架是否包含进程管理?

> A: 框架本身不进行进程管理，没有类似 egg 的 master 主进程管理子进程，没有 agent

## 贡献者

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

| [<img src="https://avatars1.githubusercontent.com/u/9758711?v=3" width="100px;"/><br /><sub>Axetroy</sub>](http://axetroy.github.io)<br />[💻](https://github.com/axetroy/kost/commits?author=axetroy) 🔌 [⚠️](https://github.com/axetroy/kost/commits?author=axetroy) [🐛](https://github.com/axetroy/kost/issues?q=author%3Aaxetroy) 🎨 |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |


<!-- ALL-CONTRIBUTORS-LIST:END -->

## 开源许可协议

The [MIT License](https://github.com/axetroy/kost/blob/master/LICENSE)
