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
$$.compile()
$$.copy()
$$.delete()
$$.link()
$$.lint()
$$.makeDirectory()
$$.reload()
$$.remove()
$$.replace()
$$.shell()
$$.task()
$$.watch()
```

### Library
```coffeescript
$$.library.$ # node-jquery-extend, a little toolkit like jQuery
$$.library._ # lodash
$$.library.Promise # bluebird
$$.library.gulp # gulp
```

### Plugin
```coffeescript
$$.plugin # most of them are gulp plugins
```

### Caution
This project is **NOT STABLE**. I made this project for writing gulpfile(s) , which of my own projects, a little easier. And that might be not very suitable for yours.

### Test
```
$ gulp test
```