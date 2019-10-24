_ = require 'lodash'

$ = try require 'fire-keeper'
catch then require '../index'

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
    for line in data

      [path, extra] = line.split '@'
      extra or= ''
      [namespace, version] = extra.split '/'
      namespace or= 'default'
      version or= '0.0.1'
        
      source = "./#{path}"
      target = "../midway/#{path}"
      {basename, dirname, extname} = $.getName target
      target = "#{dirname}/#{basename}-#{namespace}-#{version}#{extname}"

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

    result = []

    for data in listData
      result = [
        result...
        data...
      ]

    _.uniq result # return

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