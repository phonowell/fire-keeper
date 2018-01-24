# Fire Keeper

A little helper to make things simple.

## Install

```shell
npm install --save-dev fire-keeper
```

### Usage

```coffeescript
$$ = require './source/index'

$$.task 'build', -> await $$.compile './source/index.coffee', './'
```

### Method

>
    $$.backup(source)
    $$.compile(source, [target], [option])
    $$.copy(source, target, [option])
    $$.delay([time])
    $$.download(source, target, [option])
    $$.isExisted(source)
    $$.isSame(source)
    $$.link(source, target)
    $$.lint(source)
    $$.mkdir(source)
    $$.move(source, target)
    $$.read(source, [option])
    $$.recover(source)
    $$.reload(source)
    $$.remove(source)
    $$.rename(source, option)
    $$.replace(source, option...)
    $$.say(text)
    $$.shell(cmd)
    $$.source(source)
    $$.ssh()
    $$.ssh.connect(option)
    $$.ssh.disconnect()
    $$.ssh.mkdir(source)
    $$.ssh.remove(source)
    $$.ssh.shell(cmd, [option])
    $$.ssh.upload(source, target, [option])
    $$.stat(source)
    $$.task(name, [fn])
    $$.unzip(source, [target])
    $$.update()
    $$.walk(source, callback)
    $$.watch(source)
    $$.write(source, data, [option])
    $$.yargs()
    $$.zip(source, [target], [option])

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
```

### Test

```shell
gulp test
```

### Caution

This project is **NOT STABLE**.

I made this project for writing gulpfile(s) , which of my own projects, a little easier. And that might be not very suitable for yours.