kleur = require 'kleur'

class M

  ###
  $cache-time
  $cache-type
  $isSilent
  $reg-home
  $reg-root
  $separator
  ---
  execute(arg...)
  getStringTime()
  render(type, string)
  renderContent(string)
  renderPath(string)
  renderTime()
  renderType(type)
  silence_(fn_)
  ###

  '$cache-time': []
  '$cache-type': {}
  '$isSilent': false
  '$reg-root': new RegExp "^#{$.root()}", 'g'
  '$reg-home': new RegExp "^#{$.home()}", 'g'
  '$separator': "#{kleur.gray '›'} "

  execute: (arg...) ->

    unless arg.length
      return @

    [type, text] = switch arg.length
      when 1 then ['default', arg[0]]
      when 2 then arg
      else throw 'info/error: invalid argument length'

    if @$isSilent
      return text

    msg = _.trim $.parseString text
    unless msg.length
      return text

    $.i @render type, msg

    text # return

  getStringTime: ->

    date = new Date()
    listTime = [
      date.getHours()
      date.getMinutes()
      date.getSeconds()
    ]

    # return
    (_.padStart item, 2, 0 for item in listTime).join ':'

  render: (type, string) ->

    [
      @renderTime()
      @['$separator']
      @renderType type
      @renderContent string
    ].join ''

  renderContent: (string) ->

    msg = @renderPath string

    # 'xxx'
    .replace /'.*?'/g, (text) ->
      cont = text.replace /'/g, ''
      unless cont.length
        return "''"
      kleur.magenta cont
    
    msg # return

  renderPath: (string) ->

    string
    .replace @['$reg-root'], '.'
    .replace @['$reg-home'], '~'

  renderTime: ->

    cache = @['$cache-time']
    ts = _.floor _.now(), -3

    if ts == cache[0]
      return cache[1]
    cache[0] = ts

    stringTime = kleur.gray "[#{@getStringTime()}]"

    # return
    cache[1] = "#{stringTime} "

  renderType: (type) ->

    type = _.trim $.parseString type
    .toLowerCase()

    @['$cache-type'][type] or= do ->

      if type == 'default'
        return ''

      stringContent = kleur.cyan().underline type
      stringPad = _.repeat ' ', 10 - type.length

      "#{stringContent}#{stringPad} " # return

  silence_: (fn_) ->
    @$isSilent = true
    result = await fn_?()
    @$isSilent = false
    result # return

# return
m = new M()
export default (arg...) ->
  m.execute arg...