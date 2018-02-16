## The web framework base on Koa and Typescript for NodeJS

[![Greenkeeper badge](https://badges.greenkeeper.io/axetroy/kost.svg)](https://greenkeeper.io/)

In development...

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

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

| [<img src="https://avatars1.githubusercontent.com/u/9758711?v=3" width="100px;"/><br /><sub>Axetroy</sub>](http://axetroy.github.io)<br />[💻](https://github.com/axetroy/kost/commits?author=axetroy) 🔌 [⚠️](https://github.com/axetroy/kost/commits?author=axetroy) [🐛](https://github.com/axetroy/kost/issues?q=author%3Aaxetroy) 🎨 |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |


<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

The [MIT License](https://github.com/axetroy/kost/blob/master/LICENSE)
