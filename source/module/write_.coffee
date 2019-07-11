fse = require 'fs-extra'

export default (source, data, option) ->

  source = $.normalizePath source

  if ($.type data) in ['array', 'object']
    data = $.parseString data

  await fse.outputFile source, data, option

  $.info 'file', "wrote #{$.wrapList source}"

  @ # return