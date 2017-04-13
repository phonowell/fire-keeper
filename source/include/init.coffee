# require
path = require 'path'
fs = require 'fs'

$ = require 'node-jquery-extend'
{_} = $

Promise = require 'bluebird'
co = Promise.coroutine

gulp = require 'gulp'

# return

module.exports = $$ = {}

# error

_error = (msg) ->
  new Error switch msg
    when 'length' then 'invalid arguments length'
    when 'type' then 'invalid arguments type'
    else msg