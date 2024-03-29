import flatten from 'lodash/flatten'

import echo from './echo'
import normalizePath from './normalizePath'
import read from './read'
import stat from './stat'
import toString from './toString'

// function

/**
 * Check if the content of the paths are the same.
 * @param args The paths.
 * @returns `true` if the content of the paths are the same, or `false` otherwise.
 * @example
 * ```
 * await isSame('file1.txt', 'file2.txt')
 * ```
 */
const isSame = async (...args: (string | string[])[]) => {
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
    let cont = await echo.whisper<string | undefined>(read(source))
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
export default isSame
