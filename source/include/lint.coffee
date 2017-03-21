do ->
  fn = $$.lint = (key) -> fn[key]()

  fn.coffee = -> new Promise (resolve) ->
    gulp.src $$.path.coffee
    .pipe plumber()
    .pipe using()
    .pipe coffeelint()
    .pipe coffeelint.reporter()
    .on 'end', -> resolve()