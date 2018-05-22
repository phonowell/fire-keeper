# Fire Keeper

一个简单的项目构建工具。

## 安装

```shell
npm install --save-dev fire-keeper
```

## 使用

首先，在代码中引入模块。

```coffeescript
$$ = require 'fire-keeper'
```

之后就可以愉快地玩耍啦。

```coffeescript
$$.task 'build', -> await $$.compile './source/index.coffee', './'
```

## 方法

- [$$.backup(source)](doc/backup.md)
- [$$.chain(fn)](doc/chain.md)

- $$.compile(source, [target], [option])
- $$.copy(source, target, [option])
- [$$.delay([time], [callback])](doc/delay.md)
- $$.download(source, target, [option])
- [$$.isExisted(source)](doc/isExisted.md)
- [$$.isSame(source)](doc/isSame.md)
- $$.link(source, target)
- $$.lint(source)
- $$.mkdir(source)
- $$.move(source, target)
- $$.read(source, [option])
- [$$.recover(source)](doc/recover.md)
- $$.reload(source)
- [$$.remove(source)](doc/remove.md)
- $$.rename(source, option)
- $$.replace(source, option...)
- [$$.say(text)](doc/say.md)
- $$.shell(cmd, [option])
- $$.source(source)
- $$.ssh()
- $$.ssh.connect(option)
- $$.ssh.disconnect()
- $$.ssh.mkdir(source)
- $$.ssh.remove(source)
- $$.ssh.shell(cmd, [option])
- $$.ssh.upload(source, target, [option])
- $$.stat(source)
- $$.task(name, [fn])
- $$.unzip(source, [target])
- $$.update()
- $$.walk(source, callback)
- $$.watch(source)
- $$.write(source, data, [option])
- $$.yargs()
- [$$.zip(source, [target], [option])](doc/zip.md)

## 变量

```coffeescript
$$.argv # 命令行的传入参数
$$.os # 系统信息
$$.path # 路径信息
```

## 库

```coffeescript
$$.library.$ # node-jquery-extend
$$.library._ # lodash
$$.library.fse # fs-extra
$$.library.gulp # gulp
```

## 测试

```shell
gulp test
```

## 注意

该项目**并不稳定**。