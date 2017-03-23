# require
path = require 'path'
fs = require 'fs'

$ = require 'node-jquery-extend'
{_} = $

Promise = require 'bluebird'
co = Promise.coroutine

gulp = require 'gulp'

colors = require 'colors/safe'

# return

module.exports = $$ = {}

# error

ERROR =
  length: 'invalid arguments length'
  type: 'invalid arguments type'