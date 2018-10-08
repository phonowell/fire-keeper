$ = require '../index'
{_} = $

# return
module.exports = ->

	listSource = await $.source_ './test/*.coffee'

	for source in listSource

		await $.replace_ source
		, /# function\n/g
		, '# function'