do ->

  fn = (source) ->

    source = _formatSource source

    extname = path.extname(source[0]).replace /\./, ''
    if !extname.length then throw _error 'extname'

    method = extname

    fn[method] source

  fn.coffee = (source) ->

    new Promise (resolve) ->
      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe coffeelint()
      .pipe coffeelint.reporter()
      .on 'end', -> resolve()

  # return
  $$.lint = fn