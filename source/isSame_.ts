import info from './info'
import normalizePathToArray from './normalizePathToArray'
import parseString from './parseString'
import read_ from './read_'
import stat_ from './stat_'

// function

const main_ = async (
  source: string | string[],
): Promise<boolean> => {

  const listSource = normalizePathToArray(source)
  if (listSource.length < 2) return false

  // size
  let cacheSize = 0

  for (const src of listSource) {
    // eslint-disable-next-line no-await-in-loop
    const stat = await stat_(src)
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
  for (const src of listSource) {
    // eslint-disable-next-line no-await-in-loop
    let cont = await info().whisper_<string>(async () => await read_(src))
    if (!cont) return false

    cont = parseString(cont)

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