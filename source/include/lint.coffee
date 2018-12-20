###
lint_(source)
###

do ->

  # function

  fn_ = (source) ->

    source = normalizePathToArray source

    extname = path.extname(source[0]).replace /\./, ''
    if !extname.length then throw new Error 'invalid extname'

    method = switch extname
      when 'coffee' then 'coffee'
      when 'md' then 'markdown'
      when 'styl' then 'stylus'
      else throw new Error 'invalid extname'

    await fn_["#{method}_"] source

    $ # return

  ###
  coffee_(source)
  markdown_(source)
  stylus_(source)
  ###

  fn_.coffee_ = (source) ->

    new Promise (resolve) ->

      # require
      coffeelint = getPlugin 'gulp-coffeelint'

      (stream = gulp.src source)
      .on 'end', -> resolve()

      stream
      .pipe plumber()
      .pipe using()
      .pipe coffeelint()
      .pipe coffeelint.reporter()

  fn_.markdown_ = (source) ->

    new Promise (resolve) ->

      # require
      markdownlint = getPlugin 'markdownlint'

      option = files: await $.source_ source

      markdownlint option, (err, result) ->
        
        if err then throw err
        
        for filename, list of result

          if $.type(list) != 'array' then continue
          
          filename = filename
          .replace $.info['__reg_base__'], '.'
          .replace $.info['__reg_home__'], '~'
          
          $.i kleur.magenta filename
          
          for item in list

            listMsg = []
            
            listMsg.push kleur.gray "##{item.lineNumber}"
            if item.errorContext
              listMsg.push "< #{kleur.red item.errorContext} >"
            if item.ruleDescription
              listMsg.push item.ruleDescription

            $.i listMsg.join ' '
        
        resolve()

  fn_.stylus_ = (source) ->

    new Promise (resolve) ->

      # require
      stylint = getPlugin 'gulp-stylint'

      (stream = gulp.src source)
      .on 'end', -> resolve()

      stream
      .pipe plumber()
      .pipe using()
      .pipe stylint()
      .pipe stylint.reporter()

  # return
  $.lint_ = fn_