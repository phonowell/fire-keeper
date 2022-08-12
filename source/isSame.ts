import log from './log'
import normalizePath from './normalizePath'
import read from './read'
import stat from './stat'
import toArray from './toArray'
import toString from './toString'

// function

const main = async (source: string | string[]) => {
  const listSource = toArray(source).map(normalizePath)
  if (listSource.length < 2) return false

  // size
  let cacheSize = 0

  for (const src of listSource) {
    // eslint-disable-next-line no-await-in-loop
    const stats = await stat(src)
    if (!stats) return false

    const { size } = stats

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
    let cont = await log.whisper<string>(read(src))
    if (!cont) return false

    cont = toString(cont)

    if (!cacheCont) {
      cacheCont = cont
      continue
    }

    if (cont !== cacheCont) return false
  }

  return true
}

// export
export default main
