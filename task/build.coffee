$ = require '../index'
{_} = $

# return
module.exports = ->

	await $.compile_ './source/index.coffee', './',
		minify: false