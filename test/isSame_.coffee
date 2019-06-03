# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.isSame_(source)', ->

  it "$.isSame_(['./readme.md', '#{temp}/a.md', '#{temp}/b.md'])", ->
    await clean_()

    listSource = [
      './readme.md'
      "#{temp}/a.md"
      "#{temp}/b.md"
    ]

    await $.copy_ listSource[0], temp, 'a.md'
    await $.copy_ listSource[0], temp, 'b.md'

    res = await $.isSame_ listSource
    unless res
      throw new Error()

    await clean_()

  it "$.isSame_(['#{temp}/null.txt', './readme.md'])", ->
    await clean_()

    res = await $.isSame_ ["#{temp}/null/txt", './readme.md']
    if res
      throw new Error()

    await clean_()
