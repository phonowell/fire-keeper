import flatten from 'lodash/flatten'
import log from './log'
import normalizePath from './normalizePath'
import read from './read'
import stat from './stat'
import toString from './toString'

// function

const main = async (...args: (string | string[])[]) => {
  const group = flatten(args).map(normalizePath)
  if (group.length < 2) return false

  // size
  let cacheSize = 0

  for (const source of group) {
    const stats = await stat(source)
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
  for (const source of group) {
    let cont = await log.whisper<string>(read(source))
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
