import fse from 'fs-extra'

import flatten from './flatten.js'
import normalizePath from './normalizePath.js'

/**
 * Checks if all specified paths exist in filesystem
 * @param {...(string | string[])} args - Paths to check (supports files, directories, symlinks)
 * @returns {Promise<boolean>} Returns true only if all paths exist
 * @throws {Error} If any path contains glob pattern
 * @example
 * await isExist('file.txt') //=> true/false
 * await isExist('dir/', ['a.txt', 'b.txt']) //=> true if all exist
 */
const isExist = async (...args: (string | string[])[]): Promise<boolean> => {
  const originalGroup = flatten(args)
  const group = originalGroup.map(normalizePath).filter(Boolean)
  if (!group.length) return false
  if (group.length !== originalGroup.length) return false

  for (const source of group) {
    if (source.includes('*')) throw new Error(`invalid path '${source}'`)
    if (!(await fse.pathExists(source))) return false
  }

  return true
}

export default isExist
