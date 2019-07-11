it '$.lint_()', ->

  type = $.type $.lint_
  unless type == 'asyncfunction'
    throw "invalid type '#{type}'"