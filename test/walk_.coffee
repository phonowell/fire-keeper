# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.walk_(source, callback)', ->

  it "$.walk_('#{temp}')", ->
    await clean_()

    await $.mkdir_ "#{temp}/a"

    string = 'empty'

    await $.write_ "#{temp}/b/c.txt", string
    await $.write_ "#{temp}/d.txt", string

    listResult = []

    res = await $.walk_ temp, (item) ->
      listResult.push item.path

    if res != $
      throw new Error()

    unless _.isEqual listResult, $.fn.normalizePathToArray [
      temp
      "#{temp}/a"
      "#{temp}/b"
      "#{temp}/d.txt"
      "#{temp}/b/c.txt"
    ]
      throw new Error()

    await clean_()
