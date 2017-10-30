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
      when 'coffee' then 'coffee'
      when 'md' then 'markdown'
      when 'styl' then 'stylus'
      else throw makeError 'extname'

    yield fn[method] source

    # return
    $$

  ###

    coffee(source)
    markdown(source)
    stylus(source)

  ###

  fn.coffee = (source) ->

    new Promise (resolve) ->

      (stream = gulp.src source)
      .on 'end', -> resolve()

      stream
      .pipe plumber()
      .pipe using()
      .pipe coffeelint()
      .pipe coffeelint.reporter()

  fn.markdown = (source) ->

    new Promise (resolve) ->

      (stream = gulp.src source, read: false)
      .on 'end', -> resolve()

      stream
      .pipe through2.obj (file, enc, next) ->
        markdownlint
          files: [file.relative]
          (err, result) ->
            resultString = (result or '').toString()
            if resultString
              $.i resultString
            next err, file

  fn.stylus = (source) ->

    new Promise (resolve) ->

      (stream = gulp.src source)
      .on 'end', -> resolve()

      stream
      .pipe plumber()
      .pipe using()
      .pipe stylint()
      .pipe stylint.reporter()

  # return
  $$.lint = fn
