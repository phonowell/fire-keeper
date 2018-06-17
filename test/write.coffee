# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.write_(source, data, [option])', ->

  it "$.write_('#{temp}/wr/ite.txt', 'a test message')", ->
    await clean_()

    source = "#{temp}/wr/ite.txt"
    string = 'a test message'

    res = await $.write_ source, string

    if res != $
      throw new Error()

    unless await $.isExisted_ source
      throw new Error()

    cont = await $.read_ source

    if cont != string
      throw new Error()

    await clean_()

  it "$.write_('#{temp}/wr/ite.json', {message: 'a test message'})", ->
    await clean_()

    source = "#{temp}/wr/ite.json"
    string = 'a test message'
    object = message: string

    res = await $.write_ source, object

    if res != $
      throw new Error()

    unless await $.isExisted_ source
      throw new Error()

    cont = await $.read_ source

    if cont.message != string
      throw new Error()

    await clean_()