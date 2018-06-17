# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.read_(source, [option])', ->

  it "$.read_('#{temp}/test.txt')", ->
    await clean_()

    source = "#{temp}/test.txt"
    string = 'a test message'

    await $.write_ source, string

    cont = await $.read_ source

    if cont != string
      throw new Error()

    await clean_()

  it "$.read_('#{temp}/test.json')", ->
    await clean_()

    source = "#{temp}/test.json"
    string = 'a test message'
    object = message: string

    await $.write_ source, object

    cont = await $.read_ source

    if cont.message != string
      throw new Error()

    await clean_()

  it "$.read_('#{temp}/null.txt')", ->
    await clean_()

    cont = await $.read_ "#{temp}/null.txt"

    if cont?
      throw new Error()
    
    await clean_()

  it "$.read_('#{temp}/text.txt', raw: true)", ->
    await clean_()

    source = "#{temp}/test.json"
    string = 'a test message'

    await $.write_ source, string

    cont = await $.read_ source,
      raw: true

    if $.type(cont) != 'buffer'
      throw new Error()

    cont = $.parseString cont

    if cont != string
      throw new Error()

    await clean_()