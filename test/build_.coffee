it '$.build_()', ->

  type = $.type $.build_
  unless type == 'asyncfunction'
    throw 0