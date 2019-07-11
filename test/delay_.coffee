it 'default', ->

  type = $.type $.delay_
  unless type == 'asyncfunction'
    throw 0

it 'delay', ->

  ts = _.now()

  await $.delay_ 1e3

  unless 900 <= _.now() - ts <= 1100
    throw 0