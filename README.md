## The web framework base on Koa and Typescript for NodeJS

[![Greenkeeper badge](https://badges.greenkeeper.io/axetroy/kost.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/axetroy/kost.svg?branch=master)](https://travis-ci.org/axetroy/kost)
[![Coverage Status](https://coveralls.io/repos/github/axetroy/kost/badge.svg?branch=master)](https://coveralls.io/github/axetroy/kost?branch=master)
[![Dependency](https://david-dm.org/axetroy/kost.svg)](https://david-dm.org/axetroy/kost)
![License](https://img.shields.io/badge/license-MIT-green.svg)
[![Prettier](https://img.shields.io/badge/Code%20Style-Prettier-green.svg)](https://github.com/prettier/prettier)
![Node](https://img.shields.io/badge/node-%3E=8.9-blue.svg?style=flat-square)
[![npm version](https://badge.fury.io/js/%40axetroy%2Fkost.svg)](https://badge.fury.io/js/%40axetroy%2Fkost)
![Size](https://github-size-badge.herokuapp.com/axetroy/kost.svg)

kost is a web framework write in Typescript.

It base on Koa@2 and koa-router.

**Feature**

* [x] Dependency injection
* [x] Write in Typescript
* [x] Decorator for router
* [x] Middleware support
* [x] Service support
* [x] Support Customer config for different environment

**Build in Support**

* [x] Http/Websocket proxy
* [x] Static file server
* [x] Body parser
* [x] View engine
* [x] Cross-Origin Resource Sharing
* [ ] Cron task

### Architecture

![kost](https://raw.githubusercontent.com/axetroy/kost/master/kost.png)

### Quickly start

```bash
npm install @axetroy/kost --save
```

Here is the project

```
.
├── app.ts
├── configs
│   ├── default.yaml
│   ├── development.yaml
│   ├── production.yaml
│   └── test.yaml
├── controllers
│   ├── todo.ts
│   └── user.ts
├── middlewares
│   └── logger.ts
├── services
│   ├── orm.ts
│   └── user.ts
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

## [Document](https://github.com/axetroy/kost/blob/master/doc/useage.md)

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

| [<img src="https://avatars1.githubusercontent.com/u/9758711?v=3" width="100px;"/><br /><sub>Axetroy</sub>](http://axetroy.github.io)<br />[💻](https://github.com/axetroy/kost/commits?author=axetroy) 🔌 [⚠️](https://github.com/axetroy/kost/commits?author=axetroy) [🐛](https://github.com/axetroy/kost/issues?q=author%3Aaxetroy) 🎨 |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |


<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

The [MIT License](https://github.com/axetroy/kost/blob/master/LICENSE)
