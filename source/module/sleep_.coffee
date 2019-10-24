module.exports = (time = 0) ->
  
  await new Promise (resolve) ->
    setTimeout ->
      resolve()
    , time
    
  if time
    $.info 'sleep', "slept '#{time} ms'"

  @ # return