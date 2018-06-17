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

    base = temp

    listSource = []
    for key in ['a', 'b', 'c']

      source = "#{base}/[test](test)#{key}.txt"
      content = "test file #{key}"

      await $.write_ source, content
      await $.zip_ source, "#{key}.zip"
      await $.remove_ source

      listSource.push source

    res = await $.unzip_ "#{base}/*.zip"

    if res != $
      throw new Error()

    unless await $.isExisted_ listSource
      throw new Error()

    await clean_()