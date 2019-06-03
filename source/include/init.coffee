# require
path = require 'path'

gulp = require 'gulp'
kleur = require 'kleur'

$ = require 'estus-flask'
{_} = $

# variable

$.os = switch
  when ~(string = process.platform).search 'darwin' then 'macos'
  when ~string.search 'win' then 'windows'
  else 'linux'

$.path =
  base: process.cwd()
  home: require('os').homedir()

$.plugin = {}

# return
module.exports = $
