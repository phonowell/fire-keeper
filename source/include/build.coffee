do ->

  fn = $$.build = (map) -> fn.reduce map

  fn['__map__'] = {}

  fn.reduce = co (map) ->

    list = (key for key of map)
    i = 0

    do step = co ->
      isEnded = i >= list.length

      $$.divide()
      $.info 'step', "run step <#{if isEnded then 'callback' else key = list[i]}>"

      if isEnded then return

      yield (fn.select key) map[key]

      i++
      step()

  fn.select = (key) -> fn['__map__'][key]

  fn.add = (key, func) ->
    if fn.select key then throw 'function already existed'
    fn['__map__'][key] = func

  fn.remove = (key) -> delete fn['__map__'][key]

  # add default function

  fn.add 'prepare', co ->
    path = $$.path.build

    yield del path, force: true

    $.info 'mkdir', path
    fs.mkdirSync path

  fn.add 'copy', (src) ->
    new Promise (resolve) ->
      base = $$.path.source
      gulp.src src, base: base
      .pipe plumber()
      .pipe gulp.dest base
      .on 'end', -> resolve()

  fn.add 'other', co (list = []) ->
    list = _.uniq list.concat(['png', 'jpg', 'gif', 'json', 'ttf']), true
    yield (fn.select 'copy') ("#{$$.path.source}/**/*.#{a}" for a in list)

  fn.add 'yaml', co -> yield $$.compile 'secret'

  fn.add 'stylus', -> co -> yield $$.compile 'stylus', $$.path.build

  fn.add 'css', co ->
    yield $$.compile 'css', $$.path.build
    yield (fn.select 'copy') "#{$$.path.source}/**/*.min.css"

  fn.add 'coffee', co -> yield $$.compile 'coffee', $$.path.build

  fn.add 'js', co ->
    yield $$.compile 'js', $$.path.build
    yield (fn.select 'copy') "#{$$.path.source}/**/*.min.js"

  fn.add 'jade', co -> yield $$.compile 'jade', $$.path.build

  fn.add 'clean', co (list) ->
    yield del list, force: true
    $.info 'clean', (a for a in list).join ', '