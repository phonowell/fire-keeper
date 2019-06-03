$ = require '../index'

# return
module.exports = ->

  {ver} = $.argv

  source = './package.json'
  data = await $.read_ source

  ver or= await $.prompt_
    type: 'text'
    message: 'input new version'
    default: data.version
    validate: (value) ->
      unless ~value.search /^0\.0\.\d+$/
        'invalid version number'
      else true

  unless ver
    throw new Error 'empty version number'

  data.version = ver
  await $.write_ source, data
