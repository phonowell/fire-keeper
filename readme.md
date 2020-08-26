# Fire Keeper

一个简单的项目构建工具。

## 安装

```shell
npm install --save-dev fire-keeper
```

## 使用

首先，在代码中引入模块。

```typescript
import $ from 'fire-keeper'
```

之后就可以愉快地玩耍啦。

```typescript
$.task('build', async () => await $.compile_('./source/index.ts'))
```

## 方法

注意，以`_`结尾的方法均为`async function`，需要加`await`调用。

~~详情请查阅文档。~~

详情请查阅[index.d.ts](./dist/index.d.ts)。

## 编译

```shell
npm run alice build // 构建到.ts
npm run alice compile // 编译到.js
```

## 测试

```shell
npm run test
```

## 注意

该项目**可能并不稳定**。

新版本由于从`coffeescript`迁徙到`typescript`的缘故，可能**更加不稳定**了。

**最后更新于`2020/8/26`。**
