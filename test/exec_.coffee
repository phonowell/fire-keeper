it 'default', ->

  type = $.type $.exec_
  unless type == 'asyncfunction'
    throw 0

it 'npm version', ->

  [status, result] = await $.exec_ 'npm -v'
  
  unless status
    throw 0

  unless ~result.search /\d+\.\d+\.\d+/
    throw 1

it 'error', ->

  [status, result] = await $.exec_ 'fire-keeper-error'

  if status
    throw 0