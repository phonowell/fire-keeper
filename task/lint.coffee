$ = require '../index'
{_} = $

# return
module.exports = ->

	await $.task('kokoro')()

	await $.lint_ [
		'./*.md'
		'./source/**/*.md'
	]

	await $.lint_ [
		'./gulpfile.coffee'
		'./source/**/*.coffee'
		'./task/**/*.coffee'
		'./test/**/*.coffee'
	]