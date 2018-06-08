# require

$ = require './../index'
{_} = $.library

# variable

temp = './temp'

# function

clean = -> await $.remove temp

# test

describe '$.zip(source, [target], [option])', ->

  it "$.zip('#{temp}/*.txt', '#{temp}', 'temp.zip')", ->
    await clean()

    base = temp

    for key in ['a', 'b', 'c']

      source = "#{base}/#{key}.txt"
      content = "test file #{key}"

      await $.write source, content

    res = await $.zip "#{temp}/*.txt", temp, 'temp.zip'

    if res != $
      throw new Error 0

    unless await $.isExisted "#{temp}/temp.zip"
      throw new Error 1

    await clean()