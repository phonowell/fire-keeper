###
say_(text)
###

$.say_ = (text) ->

  type = $.type text
  listMessage = switch type
    when 'array' then text
    when 'boolean', 'number', 'string' then [text]
    else throw new Error "invalid type '#{type}'"

  for msg in listMessage

    $.info 'say', msg

    unless $.os == 'macos'
      continue

    msg = $.parseString msg
    .replace /[#\(\)-]/g, ''
    msg = _.trim msg

    unless msg.length
      continue

    await $.exec_ "say #{msg}",
      silent: true

  $ # return