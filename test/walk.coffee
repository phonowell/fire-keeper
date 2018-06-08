# require

$ = require './../index'
{_} = $.library

# variable

temp = './temp'

# function

clean = -> await $.remove temp

# test

describe '$.walk(source, callback)', ->

  it "$.walk('#{temp}')", ->
    await clean()

    await $.mkdir "#{temp}/a"

    string = 'empty'

    await $.write "#{temp}/b/c.txt", string
    await $.write "#{temp}/d.txt", string

    listResult = []

    res = await $.walk temp, (item) ->
      listResult.push item.path

    if res != $
      throw new Error()

    unless _.isEqual listResult, $.fn.formatPath [
      temp
      "#{temp}/a"
      "#{temp}/b"
      "#{temp}/d.txt"
      "#{temp}/b/c.txt"
    ]
      throw new Error()

    await clean()