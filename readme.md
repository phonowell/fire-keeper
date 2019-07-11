# Fire Keeper

一个简单的项目构建工具。

## 安装

```shell
npm install --save-dev fire-keeper
```

## 使用

首先，在代码中引入模块。

```coffeescript
$ = require 'fire-keeper'
```

之后就可以愉快地玩耍啦。

```coffeescript
$.task 'build', -> await $.compile_ './source/index.coffee', './'
```

## 方法

注意，以`_`结尾的方法均为`async function`，需要加`await`调用。

详情请查阅[文档](./doc/index.md)。

## 编译

```shell
gulp build
```

## 测试

```shell
gulp test
```

## 注意

该项目**可能并不稳定**。

**最后更新于`2019/7/30`。**
