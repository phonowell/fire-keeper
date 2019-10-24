os = null

fn = ->
  string = process.platform
  
  if string.includes 'darwin'
    return 'macos'

  if string.includes 'win'
    return 'windows'

  'linux'

module.exports = (name) ->
  os or= fn()

  if name
    return name == os

  os # return