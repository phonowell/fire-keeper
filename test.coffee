$$ = require './index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

$total = [0, 0]
$test = (a, b, msg) ->
  $total[0]++
  if a == b
    $.info 'success', $parseOK msg
  else
    $.info 'fail', $parseOK msg, false
    $.log "# #{a} is not #{b}"
    $total[1]++

$divide = (title) -> $.log "#{_.repeat '-', 16}#{if title then "> #{title}" else ''}"

$parseOK = (msg, ok) ->
  if !~msg.search /\[is]/
    return msg
  if ok == false
    return msg.replace /\[is]/, 'is not'
  msg.replace /\[is]/, 'is'

#$subject = [
#  1024 # number
#  'hello world' # string
#  true # boolean
#  [1, 2, 3] # array
#  {a: 1, b: 2} # object
#  -> return null # function
#  new Date() # date
#  new Error('All Right') # error
#  new Buffer('String') # buffer
#  null # null
#  undefined # undefined
#  NaN # NaN
#]

# test

# result
$.next 500, ->
  $divide 'Result'
  msg = "There has got #{$total[1]} fail(s) from #{$total[0]} test(s)."
  $.info 'result', msg

  $.next 500, -> process.exit()