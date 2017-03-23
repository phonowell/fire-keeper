_normalizePath = (src) ->

  src = switch $.type src
    when 'string' then [src]
    when 'array' then src
    else throw new Error ERROR.type

  (path.normalize _src for _src in src)

# $.info()
$.info = (args...) ->

  [method, type, msg] = switch args.length
    when 1 then ['log', 'default', args[0]]
    when 2 then ['log', args[0], args[1]]
    else args

  # time string
  cache = $.info['__cache__']
  short = _.floor _.now(), -3

  if cache[0] != short
    cache[0] = short
    date = new Date()
    cache[1] = (_.padStart a, 2, 0 for a in [date.getHours(), date.getMinutes(), date.getSeconds()]).join ':'

  arr = ["[#{cache[1]}]"]
  if type != 'default' then arr.push "<#{type.toUpperCase()}>"
  arr.push msg

  html = arr.join ' '
  html = html
  # [xxx]
  .replace /\[.*?]/g, (text) ->
    cont = text.replace /\[|]/g, ''
    "[#{colors.gray cont}]"
  # <xxx>
  .replace /<.*?>/g, (text) ->
    cont = text.replace /<|>/g, ''
    "#{colors.gray '<'}#{colors.cyan cont}#{colors.gray '>'}"
  # 'xxx'
  .replace /'.*?'/g, (text) ->
    cont = text.replace /'/g, ''
    colors.magenta cont

  console[method] html

  msg

$.info['__cache__'] = []