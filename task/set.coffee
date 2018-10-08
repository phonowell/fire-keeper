$ = require '../index'
{_} = $

# return
module.exports = ->

	{ver} = $.argv

	if !ver
		throw new Error 'empty ver'

	await $.replace_ './package.json', (cont) ->
		data = $.parseJson cont
		data.version = ver
		data