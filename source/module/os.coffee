os = null

fn = ->
  string = process.platform
  
  if ~string.search 'darwin'
    return 'macos'

  if ~string.search 'win'
    return 'windows'

  'linux'

export default (name) ->
  os or= fn()

  if name
    return name == os

  os # return