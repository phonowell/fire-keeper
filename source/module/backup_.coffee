module.exports = (source) ->

  msg = "backed up #{$.wrapList source}"

  for source in await $.source_ source

    suffix = $.getExtname source
    extname = '.bak'

    await $.info().silence_ ->
      await $.copy_ source, null, {extname, suffix}

  $.info 'backup', msg

  @ # return