_ = require 'lodash'
$ = try
  require 'fire-keeper'
catch
  require '../index'

# function

class M

  ###
  ask_(source, target)
  execute_()
  load_()
  overwrite_(source, target)
  ###

  ask_: (source, target) ->

    isExisted = [
      await $.isExisted_ source
      await $.isExisted_ target
    ]

    mtime = if isExisted[0] and isExisted[1]
      [
        (await $.stat_ source).mtimeMs
        (await $.stat_ target).mtimeMs
      ]
    else [0, 0]

    # cmd = []
    choice = []

    if isExisted[0]
      # cmd.push "open #{source}"
      choice.push
        title: [
          'overwrite, export'
          if mtime[0] > mtime[1] then '(newer)' else ''
        ].join ' '
        value: 'export'

    if isExisted[1]
      # cmd.push "open #{target}"
      choice.push
        title: [
          'overwrite, import'
          if mtime[1] > mtime[0] then '(newer)' else ''
        ].join ' '
        value: 'import'

    # if cmd.length
    #   await $.exec_ cmd

    choice.push
      title: 'skip'
      value: 'skip'

    # return
    await $.prompt_
      list: choice
      message: 'and you decide to...'
      type: 'select'

  execute_: ->

    data = await @load_()

    # diff
    for namespace, list of data

      [name, space] = namespace.split '/'
      space or= ''

      for path in list
        
        source = "./#{path}"
        target = "../#{name}/#{path}"

        if space
          {basename, dirname, extname} = $.getName target
          target = "#{dirname}/#{basename}-#{space}#{extname}"

        if await $.isSame_ [source, target]
          continue

        $.info "'#{source}' is different from '#{target}'"

        unless value = await @ask_ source, target
          break
          
        await @overwrite_ value, source, target

  load_: ->

    $.info().pause()
    listSource = await $.source_ './data/sync/**/*.yaml'
    listData = (await $.read_ source for source in listSource)
    $.info().resume()

    result = {}

    for data in listData
      
      # project name: rule list
      for key, value of data

        result[key] = _.uniq [
          (result[key] or [])...
          value...
        ]

    result # return

  overwrite_: (value, source, target) -> switch value
      
    when 'export'
      {dirname, filename} = $.getName target
      await $.copy_ source, dirname, filename

    when 'import'
      {dirname, filename} = $.getName source
      await $.copy_ target, dirname, filename

# return
module.exports = ->
  m = new M()
  await m.execute_()