# require

$ = require './../index'
{_} = $.library

# variable

temp = './temp'

# function

clean = -> await $.remove temp

# test

describe '$.write(source, data, [option])', ->

  it "$.write('#{temp}/wr/ite.txt', 'a test message')", ->
    await clean()

    source = "#{temp}/wr/ite.txt"
    string = 'a test message'

    res = await $.write source, string

    if res != $
      throw new Error()

    unless await $.isExisted source
      throw new Error()

    cont = await $.read source

    if cont != string
      throw new Error()

    await clean()

  it "$.write('#{temp}/wr/ite.json', {message: 'a test message'})", ->
    await clean()

    source = "#{temp}/wr/ite.json"
    string = 'a test message'
    object = message: string

    res = await $.write source, object

    if res != $
      throw new Error()

    unless await $.isExisted source
      throw new Error()

    cont = await $.read source

    if cont.message != string
      throw new Error()

    await clean()