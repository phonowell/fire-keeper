# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.zip_(source, [target], [option])', ->

  it "$.zip_('#{temp}/*.txt', '#{temp}', 'temp.zip')", ->
    await clean_()

    base = temp

    for key in ['a', 'b', 'c']

      source = "#{base}/#{key}.txt"
      content = "test file #{key}"

      await $.write_ source, content

    res = await $.zip_ "#{temp}/*.txt", temp, 'temp.zip'

    if res != $
      throw new Error 0

    unless await $.isExisted_ "#{temp}/temp.zip"
      throw new Error 1

    await clean_()
