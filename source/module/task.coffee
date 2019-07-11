gulp = require 'gulp'

class M

  ###
  add(name, fn)
  execute(name, fn)
  get([name])
  ###

  add: (name, fn) ->

    type = $.type fn
    unless type in ['asyncfunction', 'function']
      throw "task/error: invalid type of '#{name}()': '#{type}'"
    
    unless type == 'asyncfunction'
      # generate a wrapper
      _fn = fn
      fn = ->
        await new Promise (resolve) -> resolve()
        _fn()

    gulp.task name, fn

    @ # return

  execute: (name, fn) ->

    unless fn
      return @get name

    @add name, fn
    
    # magic value: true
    # do not change
    true

  get: (name) ->

    map = gulp._registry._tasks

    unless name
      result = {}
      for name of map
        result[name] = map[name].unwrap()
      return result
    
    result = map[name]
    unless result
      throw "task/error: invalid task '#{name}'"
    result.unwrap()

m = new M()
export default (arg...) ->
  result = m.execute arg...
  
  # magic value
  unless result == true
    return result

  @ # return