# return
module.exports = ->

	gulp = require 'gulp'
	include = require 'gulp-include'
	coffee = require 'gulp-coffee'

	gulp.src './source/index.coffee'
	.pipe include()
	.pipe coffee()
	.pipe gulp.dest './'