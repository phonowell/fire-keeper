$$.remove = co (source) ->

  source = _formatSource source

  yield del source, force: true

  $.info 'delete', "deleted #{("'#{a}'" for a in source).join ', '}"

$$.rm = $$.remove
