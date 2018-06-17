# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test
    
describe '$.isExisted_(source)', ->

  it "$.isExisted_('#{temp}/existed')", ->
    await clean_()

    source = "#{temp}/existed"

    await $.mkdir_ source

    unless await $.isExisted_ source
      throw new Error()

    await clean_()

  it "$.isExisted_('#{temp}/null')", ->
    await clean_()

    if await $.isExisted_ "#{temp}/null"
      throw new Error()

    await clean_()

  it "$.isExisted_('#{temp}/existed/existed.txt')", ->
    await clean_()

    source = "#{temp}/existed/existed.txt"

    await $.write_ source, 'existed'

    unless await $.isExisted_ source
      throw new Error()

    await clean_()

  it "$.isExisted_('#{temp}/existed/null.txt')", ->
    await clean_()

    await $.mkdir_ "#{temp}/existed"

    if await $.isExisted_ "#{temp}/existed/null.txt"
      throw new Error()

    await clean_()

  it '$.isExisted_([])', ->
    await clean_()

    isExisted = await $.isExisted_ []

    if isExisted
      throw new Error()

    await clean_()

  it "$.isExisted_(['#{temp}/a', '#{temp}/b', '#{temp}/c'])", ->
    await clean_()

    listSource = [
      "#{temp}/a"
      "#{temp}/b"
      "#{temp}/c"
    ]

    await $.mkdir_ listSource

    isExisted = await $.isExisted_ listSource

    if !isExisted
      throw new Error()

    await clean_()

  it "$.isExisted_(['#{temp}/existed.txt', '#{temp}/null.txt'])", ->
    await clean_()

    listSource = [
      "#{temp}/existed.txt"
      "#{temp}/null.txt"
    ]

    await $.write_ listSource[0], 'existed'

    isExisted = await $.isExisted_ listSource

    if isExisted
      throw new Error()

    await clean_()