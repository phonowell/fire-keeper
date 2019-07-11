_ = require 'lodash'
path = require 'path'

$ = require '../index'

class M

  ###
  check(cont)
  execute(cont, from)
  injectFunction(source, cont)
  injectLodash(cont)
  replaceExport(cont)
  replaceThrow(cont)
  ###

  check: (cont) ->
    if ~cont.search /\$\.chain \$/
      throw new Error "invalid '$.chain($)' found"
    @ # return

  execute: (cont, from) ->

    type = $.type cont
    unless type == 'string'
      throw new Error "invalid type '#{type}'"

    @check cont

    cont = @injectLodash cont
    cont = @injectFunction cont, from
    cont = @replaceExport cont
    cont = @replaceThrow cont

    cont # return

  injectFunction: (cont, from) ->

    unless ~cont.search /\$\.\w/
      return cont

    listReplace = []
    cont = cont.replace /\$\.(\w+?)[\s\(\.]/g, (text, name) ->
      listReplace.push name
      text # return

    listPrefix = [
      '$ = {}'
    ]

    for name in _.uniq listReplace
      listPrefix.push "$.#{name} = require '#{from}/#{name}'"

    # return
    [
      listPrefix...
      cont
    ].join '\n'

  injectLodash: (cont) ->

    unless ~cont.search /_\.\w/
      return cont

    listReplace = []
    cont = cont.replace /_\.(\w+?)[\s\(]/g, (text, name) ->
      listReplace.push name
      text # return

    listPrefix = [
      '_ = {}'
    ]

    for name in _.uniq listReplace
      listPrefix.push "_.#{name} = require 'lodash/#{name}'"

    # return
    [
      listPrefix...
      cont
    ].join '\n'

  replaceExport: (cont) ->
    cont.replace /export default/g, 'module.exports ='

  replaceThrow: (cont) ->
    cont.replace /throw/g, 'throw new Error'

module.exports = (arg...) ->
  m = new M()
  m.execute arg...