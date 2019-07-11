it 'default', ->

  # ./source

  source = './source'
  answer = [
    "#{$.root()}/source"
  ]

  result = $.normalizePathToArray source

  unless _.isEqual result, answer
    throw 0

  # ['./source', '~/opt', '!**/include/**']

  source = [
    './source'
    '~/opt'
    '!**/include/**'
  ]
  answer = [
    "#{$.root()}/source"
    "#{$.home()}/opt"
    "!#{$.root()}/**/include/**"
  ]

  result = $.normalizePathToArray source

  unless _.isEqual result, answer
    throw 1

  # /opt/a/b/../c
  
  source = '/opt/a/b/../c'
  answer = [
    '/opt/a/c'
  ]

  result = $.normalizePathToArray source

  unless _.isEqual result, answer
    throw 2