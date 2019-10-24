prompts = require 'prompts'

class M

  ###
  listType
  listTypeCache
  mapMessage
  pathCache
  ---
  execute_(option)
  getCache_(option)
  setCache_(option, value)
  setOption_(option)
  ###

  listType: [
    'autocomplete'
    'confirm'
    'multiselect'
    'number'
    'select'
    'text'
    'toggle'
  ]

  listTypeCache: [
    'autocomplete'
    'confirm'
    'number'
    'select'
    'text'
    'toggle'
  ]

  mapMessage:
    confirm: 'confirm'
    multiselect: 'select'
    number: 'input number'
    select: 'select'
    text: 'input text'
    toggle: 'toggle'

  pathCache: './temp/cache-prompt.json'

  # ---

  execute_: (option) ->

    type = $.type option
    unless type == 'object'
      throw "prompt_/error: invalid type '#{type}'"
    
    $.info().pause()

    option = await @setOption_ _.cloneDeep option
    
    # execute
    resRaw = await prompts option
    res = resRaw[option.name]

    await @setCache_ option, res

    $.info().resume()

    # return
    if option.raw
      return resRaw
    res

  getCache_: (option) ->

    unless option.id
      return undefined

    unless option.type in @listTypeCache
      return undefined

    cache = await $.read_ @pathCache
    unless item = _.get cache, option.id
      return undefined

    {type, value} = item
    unless type == option.type
      return undefined

    # return

    if type == 'select'
      index = _.findIndex option.choices, {value}
      unless index > -1
        return undefined
      return index

    value

  setCache_: (option, value) ->

    {id, type} = option
    unless id and value? and type in @listTypeCache
      return @

    cache = await $.read_ @pathCache
    cache or= {}
    
    cache[option.id] = {type, value}
    await $.write_ @pathCache, cache

    @ # return

  setOption_: (option) ->

    # alias
    if option.type == 'auto'
      option.type = 'autocomplete'

    # check type
    unless option.type in @listType
      throw "prompt_/error: invalid type '#{option.type}'"

    # default value
    option.message or= @mapMessage[option.type] or 'input'
    option.name or= 'value'

    if option.type in ['autocomplete', 'multiselect', 'select']
      
      unless option.choices or= option.list
        throw 'prompt_/error: empty list'
      
      for item, i in option.choices
        
        if ($.type item) == 'object'
          continue

        option.choices[i] =
          title: item
          value: item

    else if option.type == 'toggle'

      option.active or= 'on'
      option.inactive or= 'off'

    # have to be here
    # behind option.choices
    option.initial or= option.default or await @getCache_ option

    option # return

m = new M()
module.exports = (arg...) ->
  await m.execute_ arg...