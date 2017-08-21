# Fire Keeper

A little helper to make things simple.

## Install

```shell
$ npm install --save-dev phonowell/fire-keeper
```

### Usage

```coffeescript
$$ = require './source/index'
{_, Promise} = $$.library
co = Promise.coroutine

$$.task 'build', co ->
  yield $$.compile './source/index.coffee', minify: false
  yield $$.copy './source/index.js', './'
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
$$.isSame(list)
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
$$.stat(source)
$$.task(name, [fn])
$$.unzip(source, [target])
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
$$.library.gulp # gulp
$$.library.fse # fs-extra
$$.library.Promise # bluebird
```

### Caution

This project is **NOT STABLE**. I made this project for writing gulpfile(s) , which of my own projects, a little easier. And that might be not very suitable for yours.