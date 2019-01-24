# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe 'rename', ->

  it 'rename', ->
    await clean_()

    listKey = [
      'backup'
      'compile'
      'copy'
      'delay'
      'download'
      'exec'
      'isExisted'
      'isSame'
      'link'
      'lint'
      'mkdir'
      'move'
      'read'
      'recover'
      'remove'
      'rename'
      'say'
      'source'
      'stat'
      'update'
      'walk'
      'write'
      'zip'
    ]
    for key in listKey
      type = $.type $["#{key}_"]
      unless type == 'async function'
        throw new Error "invalid type of '$.#{key}_()': #{type}"
      type = $.type $["#{key}Async"]
      unless type == 'async function'
        throw new Error "invalid type of '$.#{key}Async()': #{type}"

    listKey = [
      'connect'
      'disconnect'
      'exec'
      'mkdir'
      'remove'
      'upload'
      'uploadDir'
      'uploadFile'
    ]
    for key in listKey
      type = $.type $.ssh["#{key}_"]
      unless type == 'async function'
        throw new Error "invalid type of '$.ssh.#{key}_()': #{type}"
      type = $.type $.ssh["#{key}Async"]
      unless type == 'async function'
        throw new Error "invalid type of '$.ssh.#{key}Async()': #{type}"

    await clean_()