import fse from 'fs-extra'
import flatten from 'lodash/flatten'

import normalizePath from './normalizePath'

// function

/**
 * Check if the path exists.
 * @param args The paths.
 * @returns `true` if the path exists, or `false` otherwise.
 * @example
 * ```
 * await isExist('file.txt')
 * ```
 */
const isExist = async (...args: (string | string[])[]) => {
  const group = flatten(args).map(normalizePath)
  if (!group.length) return false

  for (const source of group) {
    if (source.includes('*')) throw new Error(`invalid path '${source}'`)
    if (!(await fse.pathExists(source))) return false
  }

  return true
}

// export
export default isExist
