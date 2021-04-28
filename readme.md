# Fire Keeper

一个简单的项目构建工具。

## 安装

```shell
npm i fire-keeper
```

## 使用

首先，在代码中引入模块。

```typescript
import $ from 'fire-keeper'
```

之后就可以愉快地玩耍啦。

```typescript
$.task('build', $.compile_('./source/index.ts'))
```

## 方法

注意，以`_`结尾的方法均为`async function`，需要加`await`调用。

## 编译

```shell
npm run build
```

## 测试

```shell
npm run test
```

## 注意

该项目**可能并不稳定**。

**最后更新于`2021/4/28`。**