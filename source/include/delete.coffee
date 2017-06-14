$$.delete = co (source) ->

  source = _formatSource source

  yield del source, force: true

  $.info 'delete', "deleted #{("'#{a}'" for a in source).join ', '}"

$$.remove = $$.delete
$$.rm = $$.delete
