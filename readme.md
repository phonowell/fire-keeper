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

以`_`结尾的方法均为`async function`，需要加`await`调用。
在调用方法时，`_`亦可视作`async`的缩写。

```coffeescript
pkg = await $.readAsync './package.json'
# 等同于 $.read_()
```

- [$.backup_(source)](doc/backup.md)
- [$.chain(fn)](doc/chain.md)
- [$.copy_(source, target, [option])](doc/copy.md)
- [$.delay_([time])](doc/delay.md)
- [$.isExisted_(source)](doc/isExisted.md)
- [$.isSame_(source)](doc/isSame.md)
- [$.link_(source, target)](doc/link.md)
- [$.read_(source, [option])](doc/read.md)
- [$.recover_(source)](doc/recover.md)
- [$.remove_(source)](doc/remove.md)
- [$.say_(text)](doc/say.md)
- [$.source_(source, [option])](doc/source.md)
- [$.write_(source, data, [option])](doc/write.md)
- [$.zip_(source, [target], [option])](doc/zip.md)

- $.compile_(source, [target], [option])
- $.download_(source, target, [option])
- $.exec_(cmd, [option])
- $.getBaseame(source)
- $.getDirname(source)
- $.getExtname(source)
- $.getFilename(source)
- $.getName(source)
- $.lint_(source)
- $.mkdir_(source)
- $.move_(source, target)
- $.prompt(option)
- $.reload(source)
- $.rename_(source, option)
- $.replace_(source, option...)
- $.ssh()
- $.ssh.connect_(option)
- $.ssh.disconnect_()
- $.ssh.exec_(cmd, [option])
- $.ssh.mkdir_(source)
- $.ssh.remove_(source)
- $.ssh.upload_(source, target, [option])
- $.stat_(source)
- $.task(name, [fn])
- $.update_()
- $.walk_(source, callback)
- $.watch(source)
- $.yargs()

## 变量

```coffeescript
$.argv # 命令行的传入参数
$.os # 系统信息
$.path # 路径信息
```

## 库

```coffeescript
$.library._ # lodash
$.library.fse # fs-extra
$.library.gulp # gulp
```

## 测试

```shell
gulp test
```

## 注意

该项目**并不特别稳定**。