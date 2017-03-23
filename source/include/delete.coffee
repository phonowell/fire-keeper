$$.delete = co (source) ->
  source = _normalizePath source
  yield del source, force: true
  $.info 'delete', "deleted '#{source.join "', '"}'"

$$.remove = $$.delete
$$.rm = $$.delete
