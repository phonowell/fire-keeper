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
      'replace'
      'say'
      'shell'
      'source'
      'stat'
      'unzip'
      'update'
      'walk'
      'write'
      'zip'
    ]
    for key in listKey
      type = $.type $["#{key}Async"]
      if type != 'async function'
        throw new Error "#{key} / #{type}"

    listKey = [
      'connect'
      'disconnect'
      'mkdir'
      'remove'
      'shell'
      'upload'
    ]
    for key in listKey
      $.type $.ssh["#{key}Async"]
      if type != 'async function'
        throw new Error "#{key} / #{type}"

    await clean_()