###
unzip_(source, [target])
###

$.unzip_ = (source, target) ->

  unless source
    throw new Error 'invalid source'

  listSource = await $.source_ source

  # require
  unzip = getPlugin 'unzip'

  for src in listSource

    dist = target or $.getDirname src

    await new Promise (resolve) ->
      stream = fs.createReadStream src
      stream.on 'end', -> resolve()
      stream.pipe unzip.Extract
        path: dist

    $.info 'zip', "unzipped #{src} to #{dist}"

  $ # return