export default (time = 0) ->
  
  await new Promise (resolve) ->
    setTimeout ->
      resolve()
    , time
    
  if time
    $.info 'delay', "delayed '#{time} ms'"

  @ # return