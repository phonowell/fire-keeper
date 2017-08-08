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