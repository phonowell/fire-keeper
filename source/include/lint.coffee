###
lint_(source)
###

class Linter

  ###
  mapMethod
  ###

  mapMethod:
    '.coffee': 'lintCoffee_'
    '.md': 'lintMd_'
    '.styl': 'lintStyl_'

  ###
  execute_(source)
  lintCoffee_(source)
  lintMd_(source)
  lintStyl_(source)
  ###

  execute_: (source) ->

    listSource = await $.source_ source

    for source in listSource
      extname = $.getExtname source
      
      method = @mapMethod[extname]
      method or throw new Error "invalid extname '#{extname}'"

      await @[method] source

    @ # return

  lintCoffee_: (source) ->

    await new Promise (resolve) ->

      lint = getPlugin 'gulp-coffeelint'

      # does not know why
      # have to put 'on()' before 'pipe()'
      # strange
      gulp.src source
      .on 'end', -> resolve()
      .pipe using()
      .pipe lint()
      .pipe lint.reporter()

    @ # return

  lintMd_: (source) ->

    await new Promise (resolve) ->

      lint = getPlugin 'markdownlint'

      option = files: source
      
      lint option, (err, result) ->
        
        if err
          throw err
        
        for filename, list of result

          unless 'array' == $.type list
            continue

          filename = $.info.renderPath filename
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

    @ # return

  lintStyl_: (source) ->

    await new Promise (resolve) ->

      lint = getPlugin 'gulp-stylint'

      gulp.src source
      .pipe using()
      .pipe lint()
      .pipe lint.reporter()
      .on 'end', -> resolve()
      
    @ # return

# return
$.lint_ = (arg...) ->
  linter = new Linter()
  await linter.execute_ arg...
  $ # return