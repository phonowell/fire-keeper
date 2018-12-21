###
unzip_(source, [target])
###

$.unzip_ = (source, target) ->

  listSource = await $.source_ source
  unless listSource.length
    return $

  # require
  unzip = getPlugin 'unzip'

  for source in listSource

    dist = target or $.getDirname source

    await new Promise (resolve) ->
      fs.createReadStream source
      .pipe unzip.Extract path: dist
      # must be 'close' here!
      .on 'close', -> resolve()

    $.info 'zip', "unzipped '#{source}' to '#{dist}'"

  $ # return