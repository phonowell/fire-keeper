# require
$ = require 'node-jquery-extend'
{_} = $

Promise = require 'bluebird'
co = Promise.coroutine

gulp = require 'gulp'

# return

module.exports = $$ = {}

# error

ERROR =
  length: 'invalid arguments length'
  type: 'invalid arguments type'