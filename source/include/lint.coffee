###

  getLintRule(filename)

###

getLintRule = co (filename) ->

  source = "./#{filename}.yaml"
  isExisted = yield $$.isExisted source

  if !isExisted
    return null

  $.info.pause 'getLintRule'

  yield $$.compile source
  fileTemp = "./#{filename}.json"
  rule = yield $$.read fileTemp
  yield $$.remove fileTemp

  $.info.resume 'getLintRule'

  # return
  rule

###

  lint(source)

###

do ->

  # function

  fn = co (source) ->

    source = formatPath source

    extname = path.extname(source[0]).replace /\./, ''
    if !extname.length then throw makeError 'extname'

    method = switch extname
      when 'coffee' then extname
      when 'styl' then 'stylus'
      else throw makeError 'extname'

    yield fn[method] source

    # return
    $$

  ###

    coffee(source)
    stylus(source)

  ###

  fn.coffee = co (source) ->

    rule = yield getLintRule 'coffeelint'

    new Promise (resolve) ->

      (stream = gulp.src source)
      .on 'end', -> resolve()

      stream
      .pipe plumber()
      .pipe using()
      .pipe coffeelint rule
      .pipe coffeelint.reporter()

  fn.stylus = co (source) ->

    rule = yield getLintRule 'stylint'

    new Promise (resolve) ->

      (stream = gulp.src source)
      .on 'end', -> resolve()

      stream
      .pipe plumber()
      .pipe using()
      .pipe stylint rules: rule
      .pipe stylint.reporter()

  # return
  $$.lint = fn
