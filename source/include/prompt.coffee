###
prompt(option)
###

$.prompt = (option) ->
  
  type = $.type option
  unless type == 'object'
    throw new Error "invalid type '#{type}'"

  # default value
  option.initial or= option.default
  option.message or= $.prompt.mapMessage[option.type] or 'input'
  option.name or= 'value'

  if option.type in ['autocomplete', 'multiselect', 'select']
    unless option.choices or= option.choice
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
  
  # execute
  $.prompt.fn or= require 'prompts'
  res = await $.prompt.fn option

  # return
  if option.raw
    return res
  res[option.name]

$.prompt.mapMessage =
  confirm: 'confirm'
  multiselect: 'select'
  number: 'input number'
  select: 'select'
  text: 'input text'
  toggle: 'toggle'