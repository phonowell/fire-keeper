export default (list) ->
  
  unless list?
    return ''
  
  list = $.formatArgument list
  ("'#{key}'" for key in list).join ', '