it '$.task', ->

  type = $.type $.task
  unless type == 'function'
    throw 0

it '$.task()', ->

  type = $.type result = $.task()
  unless type == 'object'
    throw 0

  unless result.default
    throw 1

it "$.task('default')", ->

  type = $.type $.task 'default'
  unless type == 'asyncfunction'
    throw 0

it "$.task('_test', fn)", ->

  fn = -> null
  
  result = $.task '_test', fn
  unless result == $
    throw 0

  # notice: fn should be wrapped into an async function
  if ($.task '_test') == fn
    throw 1

  fn_ = -> await $.sleep_()
  $.task '_test', fn_

  unless ($.task '_test') == fn_
    throw 2