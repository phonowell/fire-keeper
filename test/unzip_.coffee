# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.unzip_(source, [target])', ->

  it "$.unzip_('#{temp}/*.zip')", ->
    await clean_()

    listKey = ['a', 'b', 'c']
    listContent = []
    listSource = []
    listTarget = []
    for key in listKey
      listContent.push "test file #{key}"
      listSource.push "#{temp}/#{key}.txt"
      listTarget.push "#{temp}/#{key}.zip"

    for key, i in listKey

      await $.chain $
      .write_ listSource[i], listContent[i]
      .zip_ listSource[i], "#{key}.zip"
      .remove_ listSource[i]

    res = await $.unzip_ listTarget
    unless res == $
      throw new Error 0

    unless await $.isExisted_ listSource
      throw new Error 1

    for key, i in listKey

      unless listContent[i] == await $.read_ listSource[i]
        throw new Error()

    await clean_()