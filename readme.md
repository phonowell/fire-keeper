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

方法名末尾带有`_`符号的方法，均为`async function`，须使用`await`调用。

- [$.backup_(source)](doc/backup.md)
- [$.chain(fn)](doc/chain.md)
- $.compile_(source, [target], [option])
- [$.copy_(source, target, [option])](doc/copy.md)
- [$.delay_([time], [callback])](doc/delay.md)
- $.download_(source, target, [option])
- [$.isExisted_(source)](doc/isExisted.md)
- [$.isSame_(source)](doc/isSame.md)
- [$.link_(source, target)](doc/link.md)
- $.lint_(source)
- $.mkdir_(source)
- $.move_(source, target)
- [$.read_(source, [option])](doc/read.md)
- [$.recover_(source)](doc/recover.md)
- $.reload(source)
- [$.remove_(source)](doc/remove.md)
- $.rename_(source, option)
- $.replace_(source, option...)
- [$.say_(text)](doc/say.md)
- $.shell_(cmd, [option])
- [$.source_(source)](doc/source.md)
- $.ssh()
- $.ssh.connect_(option)
- $.ssh.disconnect_()
- $.ssh.mkdir_(source)
- $.ssh.remove_(source)
- $.ssh.shell_(cmd, [option])
- $.ssh.upload_(source, target, [option])
- $.stat_(source)
- $.task(name, [fn])
- $.unzip_(source, [target])
- $.update_()
- $.walk_(source, callback)
- $.watch(source)
- [$.write_(source, data, [option])](doc/write.md)
- $.yargs()
- [$.zip_(source, [target], [option])](doc/zip.md)

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