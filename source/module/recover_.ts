import $ from '..'

// function

async function main_(
  source: string | string[]
): Promise<void> {

  const msg: string = `recovered ${$.wrapList(source)}`

  for (const src of $.normalizePathToArray(source)) {

    const pathBak: string = `${src}.bak`
    if (!await $.isExisted_(pathBak)) {
      $.info('recover', `'${pathBak}' not found`)
      continue
    }

    const filename: string = $.getFilename(src)

    $.info().pause()
    await $.remove_(src)
    await $.copy_(pathBak, '', filename)
    await $.remove_(pathBak)
    $.info().resume()
  }

  $.info('recover', msg)
}

// export
export default main_