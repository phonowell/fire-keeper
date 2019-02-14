class Prompt

  ###
  execute_(option)
  getCache_(option)
  listType
  mapMessage
  namespace
  pathCache
  setCache_(option, value)
  setOption_(option)
  ###

  execute_: (option) ->

    type = $.type option
    unless type == 'object'
      throw new Error "invalid type '#{type}'"

    $.info.pause @namespace

    option = _.cloneDeep option
    option = await @setOption_ option
    
    # execute
    @fn_ or= require 'prompts'
    resRaw = await @fn_ option
    res = resRaw[option.name]

    await @setCache_ option, res

    $.info.resume @namespace

    # return
    if option.raw
      return resRaw
    res

  getCache_: (option) ->

    unless option.id
      return undefined

    unless option.type in @listType
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

  listType: [
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

  namespace: '$.prompt'

  pathCache: './temp/cache-prompt.json'

  setCache_: (option, value) ->

    {id, type} = option
    unless id and value? and type in @listType
      return @

    cache = await $.read_ @pathCache
    cache or= {}
    
    cache[option.id] = {type, value}
    await $.write_ @pathCache, cache

    @ # return

  setOption_: (option) ->

    # default value
    option.message or= @mapMessage[option.type] or 'input'
    option.name or= 'value'

    if option.type in ['autocomplete', 'multiselect', 'select']
      unless option.choices or= option.choice or option.list
        throw new Error 'got no choice(s)'
      for item, i in option.choices
        type = $.type item
        if type == 'object'
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

# return
$.prompt = (arg...) ->
  prompt = $.prompt.fn or= new Prompt()
  await prompt.execute_ arg...