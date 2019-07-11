it '$.prompt_()', ->

  type = $.type $.prompt_
  unless type == 'asyncfunction'
    throw 0