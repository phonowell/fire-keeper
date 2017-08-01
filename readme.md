# Fire Keeper

A little helper to make things simple.

## Install

```
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
$$.cp(source, target, [option])
$$.delay([time])
$$.download(source, target, [option])
$$.isExisted(source)
$$.link(source, target)
$$.lint(source)
$$.ln(source, target)
$$.mkdir(source)
$$.read(source)
$$.recover(source)
$$.reload(source)
$$.remove(source)
$$.rename(source, option)
$$.replace(pathSource, [pathTarget], target, replacement)
$$.rm(source)
$$.shell(cmd)
$$.task(name, [fn])
$$.unzip(source, [target])
$$.watch(source)
$$.write(source, data)
$$.zip(source, [target], [option])
```

### Library

```coffeescript
$$.library.$ # node-jquery-extend, a little toolkit like jQuery
$$.library._ # lodash
$$.library.Promise # bluebird
$$.library.gulp # gulp
```

### Caution

This project is **NOT STABLE**. I made this project for writing gulpfile(s) , which of my own projects, a little easier. And that might be not very suitable for yours.