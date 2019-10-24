module.exports = (arg) ->
  switch type = $.type arg
    when 'array' then _.clone arg
    when 'boolean', 'number', 'string' then [arg]
    else throw "formatArgument/error: invalid type '#{type}'"