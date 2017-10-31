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

    new Promise co (resolve) ->

      option = files: yield $$.source source

      markdownlint option, (err, result) ->
        
        if err then throw err
        
        for filename, list of result

          if $.type(list) != 'array' then continue
          
          filename = filename
          .replace $.info['__reg_base__'], '.'
          .replace $.info['__reg_home__'], '~'
          
          $.i colors.magenta filename
          
          for item in list

            listMsg = []
            
            listMsg.push colors.gray "##{item.lineNumber}"
            if item.errorContext
              listMsg.push "< #{colors.red item.errorContext} >"
            if item.ruleDescription
              listMsg.push item.ruleDescription

            $.i listMsg.join ' '
        
        resolve()

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
