gulp = require 'gulp'
kleur = require 'kleur'
using = require 'gulp-using'

class M

  ###
  mapMethod

  execute_(source)
  lintCoffee_(source)
  lintMd_(source)
  lintStyl_(source)
  lintTs_(source)
  ###

  mapMethod:
    '.coffee': 'lintCoffee_'
    '.md': 'lintMd_'
    '.styl': 'lintStyl_'
    # '.ts': 'lintTs_'

  execute_: (source) ->

    listSource = await $.source_ source

    for source in listSource
      extname = $.getExtname source
      
      method = @mapMethod[extname]
      method or throw "lint_/error: invalid extname '#{extname}'"

      await @[method] source

    @ # return

  lintCoffee_: (source) ->

    await new Promise (resolve) ->

      lint = require 'gulp-coffeelint'

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

      lint = require 'markdownlint'

      option = files: source
      
      lint option, (err, result) ->
        
        if err
          throw err
        
        for filename, list of result

          unless 'array' == $.type list
            continue

          filename = $.info().renderPath filename
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

      lint = require 'gulp-stylint'

      # just like coffee
      # also have to put 'on()' before 'pipe()'
      gulp.src source
      .on 'end', -> resolve()
      .pipe using()
      .pipe lint()
      .pipe lint.reporter()
      
    @ # return

  # lintTs_: (source) ->

  #   await new Promise (resolve) ->

  #     lint = require 'gulp-tslint'

  #     gulp.src source
  #     .pipe using()
  #     .pipe lint()
  #     .pipe lint.report()
  #     .on 'end', -> resolve()

  #   @ # return

# return
module.exports = (arg...) ->
  m = new M()
  await m.execute_ arg...
  @ # return