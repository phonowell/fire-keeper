$$.remove = co (source) ->

  source = _formatSource source

  yield del source, force: true

  $.info 'remove', "removed #{("'#{a}'" for a in source).join ', '}"

$$.rm = $$.remove
