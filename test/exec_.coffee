# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.exec_(cmd, [option])', ->

  ###
  async function
  console.log('Aloha')
  error
  ###

  it 'async function', ->

    type = $.type $.exec_
    unless type == 'async function'
      throw new Error()

  it 'npm version', ->

    [status, result] = await $.exec_ 'npm -v'
    
    unless status
      throw new Error()

    unless ~result.search /\d+\.\d+\.\d+/
      throw new Error()

  it 'error', ->

    [status, result] = await $.exec_ 'fire-keeper-error'

    if status
      throw new Error()
