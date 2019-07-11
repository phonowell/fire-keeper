it '$._watch()', ->

  type = $.type $._watch
  unless type == 'function'
    throw 0