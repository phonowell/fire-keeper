export default (source) ->
  groupSource = $.formatArgument source
  ($.normalizePath source for source in groupSource)