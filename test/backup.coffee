# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.backup_(source)', ->

  it "$.backup_(['#{temp}/license.md', '#{temp}/readme.md'])", ->
    await clean_()

    listSource = [
      "#{temp}/license.md"
      "#{temp}/readme.md"
    ]

    listTarget = [
      "#{temp}/license.md.bak"
      "#{temp}/readme.md.bak"
    ]

    await $.copy_ [
      './license.md'
      './readme.md'
    ], temp

    res = await $.backup_ listSource

    if res != $
      throw new Error 0

    unless await $.isExisted_ listTarget
      throw new Error 1

    option = raw: true
    listSourceData = (await $.read_ source, option for source in listSource)
    listTargetData = (await $.read_ target, option for target in listTarget)

    unless _.isEqual listSourceData, listTargetData
      throw new Error 2

    await clean_()