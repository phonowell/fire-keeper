# require

$$ = require './../index'
{$, _} = $$.library

# variable

temp = './temp'

# function

clean = -> await $$.remove temp

# test

describe '$$.link(source, target)', ->

  it "$$.link('./../gurumin/source', '#{temp}/gurumin')", ->
    await clean()

    res = await $$.link './../gurumin/source'
    , "#{temp}/gurumin"

    if res != $$
      throw new Error()

    unless await $$.isExisted "#{temp}/gurumin"
      throw new Error()

    unless await $$.isExisted "#{temp}/gurumin/script/include/core/$.ago.coffee"
      throw new Error()

    await clean()