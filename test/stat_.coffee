# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.stat_(source)', ->

  it '$.stat_("./temp/package.json")', ->
    await clean_()

    await $.copy_ './package.json', temp

    stat = await $.stat_ './package.json'

    if $.type(stat) != 'object'
      throw new Error()

    if $.type(stat.atime) != 'date'
      throw new Error()

    if $.type(stat.size) != 'number'
      throw new Error()

    await clean_()

  it '$.stat_("./temp/null.txt")', ->
    await clean_()

    stat = await $.stat_ "#{temp}/null.txt"

    if stat?
      throw new Error()

    await clean_()
