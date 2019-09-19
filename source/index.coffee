path = require 'path'

$ = {}

# inject module
listLazyModule = []

for key in listLazyModule
  do (key) ->

    $[key] = unless key.endsWith '_'

      # function
      (arg...) ->
        $[key] = require path.resolve __dirname, "dist/#{key}.js"
        $[key] arg...

    else

      # async function
      (arg...) ->
        $[key] = require path.resolve __dirname, "dist/#{key}.js"
        await $[key] arg...

# inject task
listLazyTask = []

for key in listLazyTask
  do (key) ->

    $.task key, (arg...) ->
      fn_ = require path.resolve __dirname, "dist/task/#{key}"
      await fn_ arg...

# return
module.exports = $