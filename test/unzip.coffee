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
      listSource.push "#{temp}/[test](test)#{key}.txt"
      listTarget.push "#{temp}/#{key}.zip"

    for key, i in listKey

      await $.write_ listSource[i], listContent[i]
      await $.zip_ listSource[i], "#{key}.zip"
      await $.remove_ listSource[i]

    unless await $.isExisted_ listTarget
      throw new Error 1

    res = await $.unzip_ listTarget
    unless res == $
      throw new Error 0

    unless await $.isExisted_ listSource
      throw new Error 2

    for key, i in listKey

      unless listContent[i] == await $.read_ listSource[i]
        throw new Error()

    await clean_()