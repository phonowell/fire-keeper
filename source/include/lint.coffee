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

  fn.coffee = (source) ->

    new Promise (resolve) ->
      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe coffeelint()
      .pipe coffeelint.reporter()
      .on 'end', -> resolve()

  fn.stylus = (source) ->

    new Promise (resolve) ->
      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe stylint()
      .pipe stylint.reporter()
      .on 'end', -> resolve()

  # return
  $$.lint = fn
