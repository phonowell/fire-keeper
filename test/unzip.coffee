# require

$ = require './../index'
{_} = $.library

# variable

temp = './temp'

# function

clean = -> await $.remove temp

# test

describe '$.unzip(source, [target])', ->

  it "$.unzip('#{temp}/*.zip')", ->
    await clean()

    base = temp

    listSource = []
    for key in ['a', 'b', 'c']

      source = "#{base}/[test](test)#{key}.txt"
      content = "test file #{key}"

      await $.write source, content
      await $.zip source, "#{key}.zip"
      await $.remove source

      listSource.push source

    res = await $.unzip "#{base}/*.zip"

    if res != $
      throw new Error()

    unless await $.isExisted listSource
      throw new Error()

    await clean()