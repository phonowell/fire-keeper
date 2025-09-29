import fse from 'fs-extra'

import flatten from './flatten.js'
import normalizePath from './normalizePath.js'

/**
 * Check if all specified paths exist in filesystem
 * @param args - File/directory paths to verify (supports nested arrays)
 * @returns Promise resolving to true only if all paths exist
 * @example
 * await isExist('config.json')           // Check single file
 * await isExist(['file1.txt', 'dir/'])   // Check multiple paths
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
