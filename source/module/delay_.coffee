$.delay_ = (time = 0) ->
  
  await new Promise (resolve) ->
    setTimeout ->
      resolve()
    , time
    
  $.info 'delay', "delayed '#{time} ms'"

  $ # return
