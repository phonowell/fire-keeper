import $ from '..'

// function

async function main_(
  source: string | string[]
): Promise<boolean> {

  const listSource = $.normalizePathToArray(source)
  if (listSource.length < 2) return false

  // size
  let cacheSize = 0
  for (const source of listSource) {
    const stat = await $.stat_(source)
    if (!stat) return false

    const { size } = stat

    if (!cacheSize) {
      cacheSize = size
      continue
    }

    if (size !== cacheSize) return false
  }

  // content
  let cacheCont = ''
  for (const source of listSource) {
    let cont = await $.info().whisper_(async () =>
      await $.read_(source)
    ) as string
    if (!cont) return false

    cont = $.parseString(cont)

    if (!cacheCont) {
      cacheCont = cont
      continue
    }

    if (cont !== cacheCont) return false
  }

  return true
}

// export
export default main_