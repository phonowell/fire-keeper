export default ->
  
  list = _.keys $.task()
  list.sort()
  
  $.info 'task', $.wrapList list

  name = await $.prompt_
    id: 'default-gulp'
    type: 'autocomplete'
    list: list
    message: 'task'

  unless name in list
    throw "task/default/error: invalid task '#{name}'"

  await $.task(name)()

  @ # return