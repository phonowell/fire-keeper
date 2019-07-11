export default (ipt) ->
  switch type = $.type ipt
    when 'array', 'object' then ipt
    when 'string', 'uint8array' then JSON.parse ipt
    else throw "parseJson/error: invalid type '#{type}'"