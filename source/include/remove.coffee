$$.remove = co (source) ->

  source = _formatPath source

  yield del source, force: true

  $.info 'remove', "removed '#{source}'"

$$.rm = $$.remove
