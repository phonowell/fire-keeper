###
lint_(source)
###

class Linter

  ###
  mapMethod
  ###

  mapMethod:
    '.coffee': 'coffee_'
    '.md': 'markdown_'
    '.styl': 'stylus_'

  ###
  coffee_(source)
  execute_(source)
  markdown_(source)
  stylus_(source)
  ###

  coffee_: (source) ->

    await new Promise (resolve) ->

      lint = getPlugin 'gulp-coffeelint'

      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe lint()
      .pipe lint.reporter()
      .on 'end', -> resolve()

    @ # return

  execute_: (source) ->

    listSource = await $.source_ source

    for source in listSource
      extname = $.getExtname source
      
      method = @mapMethod[extname]
      method or throw new Error "invalid extname '#{extname}'"

      await @[method] source

    @ # return

  markdown_: (source) ->

    await new Promise (resolve) ->

      lint = getPlugin 'markdownlint'

      option = files: source
      
      lint option, (err, result) ->
        if err then throw err
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

  stylus_: (source) ->

    await new Promise (resolve) ->

      lint = getPlugin 'gulp-stylint'

      gulp.src source
      .pipe plumber()
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