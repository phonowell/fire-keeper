# require

path = require 'path'
fs = require 'fs'

colors = require 'colors/safe'
fse = require 'fs-extra'

$ = require 'node-jquery-extend'
{_} = $

Promise = require 'bluebird'
co = Promise.coroutine

gulp = require 'gulp'

# return

module.exports = $$ = {}
