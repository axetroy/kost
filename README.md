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

Kost 基于 Koa，使用 Typescript 编写，借鉴于 egg 的"约定大于配置"的思想以及 nest 的依赖注入和装饰器路由。

是一款内置多个功能，并遵循一系列规范的 Web 框架

**特性**

* [x] 依赖注入
* [x] 使用 Typescript 编写
* [x] 装饰器风格的路由定义
* [x] 支持中间件，包括 Koa 的中间件
* [x] 引入服务的概念
* [x] 支持加载不同环境下的配置文件

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

这是示例的项目目录

```
example/
├── app.ts
├── configs
│   ├── default.config.yaml
│   ├── development.config.yaml
│   ├── production.config.yaml
│   └── test.config.yaml
├── controllers
│   ├── todo.controller.ts
│   └── user.controller.ts
├── middlewares
│   └── logger.middleware.ts
├── services
│   ├── orm.service.ts
│   └── user.service.ts
├── static
│   └── test.text
├── tsconfig.json
└── views
    └── index.html
```

```typescript
// app.ts
import Kost from "@axetroy/kost";

new Kost().start().catch(function(err) {
  console.error(err);
});
```

```bash
$ ts-node ./app.ts
```

## [文档](https://github.com/axetroy/kost/blob/master/doc/useage.md)

## 贡献者

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

| [<img src="https://avatars1.githubusercontent.com/u/9758711?v=3" width="100px;"/><br /><sub>Axetroy</sub>](http://axetroy.github.io)<br />[💻](https://github.com/axetroy/kost/commits?author=axetroy) 🔌 [⚠️](https://github.com/axetroy/kost/commits?author=axetroy) [🐛](https://github.com/axetroy/kost/issues?q=author%3Aaxetroy) 🎨 |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |


<!-- ALL-CONTRIBUTORS-LIST:END -->

## 开源许可协议

The [MIT License](https://github.com/axetroy/kost/blob/master/LICENSE)
