###
lint_(source)
###

do ->

  # function

  fn_ = (source) ->

    source = formatPath source

    extname = path.extname(source[0]).replace /\./, ''
    if !extname.length then throw makeError 'extname'

    method = switch extname
      when 'coffee' then 'coffee'
      when 'md' then 'markdown'
      when 'styl' then 'stylus'
      else throw makeError 'extname'

    await fn_["#{method}_"] source

    $ # return

  ###
  coffee_(source)
  markdown_(source)
  stylus_(source)
  ###

  fn_.coffee_ = (source) ->

    new Promise (resolve) ->

      (stream = gulp.src source)
      .on 'end', -> resolve()

      stream
      .pipe plumber()
      .pipe using()
      .pipe coffeelint()
      .pipe coffeelint.reporter()

  fn_.markdown_ = (source) ->

    new Promise (resolve) ->

      option = files: await $.source_ source

      markdownlint option, (err, result) ->
        
        if err then throw err
        
        for filename, list of result

          if $.type(list) != 'array' then continue
          
          filename = filename
          .replace $.info['__reg_base__'], '.'
          .replace $.info['__reg_home__'], '~'
          
          $.i chalk.magenta filename
          
          for item in list

            listMsg = []
            
            listMsg.push chalk.gray "##{item.lineNumber}"
            if item.errorContext
              listMsg.push "< #{chalk.red item.errorContext} >"
            if item.ruleDescription
              listMsg.push item.ruleDescription

            $.i listMsg.join ' '
        
        resolve()

  fn_.stylus_ = (source) ->

    new Promise (resolve) ->

      (stream = gulp.src source)
      .on 'end', -> resolve()

      stream
      .pipe plumber()
      .pipe using()
      .pipe stylint()
      .pipe stylint.reporter()

  # return
  $.lint_ = fn_