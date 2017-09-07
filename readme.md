# Fire Keeper

A little helper to make things simple.

## Install

```shell
$ npm i --save-dev fire-keeper
```

### Usage

```coffeescript
$$ = require './source/index'
{_, Promise} = $$.library
co = Promise.coroutine

$$.task 'build', co -> yield $$.compile './source/index.coffee', './'
```

### Method

```
$$.backup(source)
$$.compile(source, [target], [option])
$$.copy(source, target, [option])
$$.delay([time])
$$.download(source, target, [option])
$$.isChanged(source)
$$.isExisted(source)
$$.isSame(source)
$$.link(source, target)
$$.lint(source)
$$.mkdir(source)
$$.read(source)
$$.recover(source)
$$.reload(source)
$$.remove(source)
$$.rename(source, option)
$$.replace(pathSource, [pathTarget], target, replacement)
$$.shell(cmd)
$$.ssh()
$$.ssh.connect(option)
$$.ssh.disconnect()
$$.ssh.mkdir(source)
$$.ssh.remove(source)
$$.ssh.shell(cmd)
$$.ssh.upload(source, target, [option])
$$.stat(source)
$$.task(name, [fn])
$$.unzip(source, [target])
$$.walk(source, callback)
$$.watch(source)
$$.write(source, data, [option])
$$.yargs()
$$.zip(source, [target], [option])
```

### Variable

```coffeescript
$$.argv
$$.os
$$.path
```

### Library

```coffeescript
$$.library.$ # node-jquery-extend, a little toolkit like jQuery
$$.library._ # lodash
$$.library.fse # fs-extra
$$.library.gulp # gulp
$$.library.Promise # bluebird
```

### Test

```shell
$ gulp test
```

or

```shell
$ gulp prepare // compile test files
$ npm test
```

### Caution

This project is **NOT STABLE**. I made this project for writing gulpfile(s) , which of my own projects, a little easier. And that might be not very suitable for yours.
