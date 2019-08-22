it 'default', ->

  type = $.type $.sleep_
  unless type == 'asyncfunction'
    throw 0

it 'sleep', ->

  ts = _.now()

  await $.sleep_ 1e3

  unless 900 <= _.now() - ts <= 1100
    throw 0