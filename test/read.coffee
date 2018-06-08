# require

$ = require './../index'
{_} = $.library

# variable

temp = './temp'

# function

clean = -> await $.remove temp

# test

describe '$.read(source, [option])', ->

  it "$.read('#{temp}/test.txt')", ->
    await clean()

    source = "#{temp}/test.txt"
    string = 'a test message'

    await $.write source, string

    cont = await $.read source

    if cont != string
      throw new Error()

    await clean()

  it "$.read('#{temp}/test.json')", ->
    await clean()

    source = "#{temp}/test.json"
    string = 'a test message'
    object = message: string

    await $.write source, object

    cont = await $.read source

    if cont.message != string
      throw new Error()

    await clean()

  it "$.read('#{temp}/null.txt')", ->
    await clean()

    cont = await $.read "#{temp}/null.txt"

    if cont?
      throw new Error()
    
    await clean()

  it "$.read('#{temp}/text.txt', raw: true)", ->
    await clean()

    source = "#{temp}/test.json"
    string = 'a test message'

    await $.write source, string

    cont = await $.read source,
      raw: true

    if $.type(cont) != 'buffer'
      throw new Error()

    cont = $.parseString cont

    if cont != string
      throw new Error()

    await clean()