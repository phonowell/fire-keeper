import fse from 'fs-extra'

import flatten from './flatten'
import normalizePath from './normalizePath'

/**
 * Check if one or more paths exist in the filesystem. Supports files, directories, and symbolic links.
 * All paths are automatically normalized before checking.
 *
 * @param {...(string | string[])} args - The paths to check. Can be single paths or arrays of paths.
 *   - Supports files, directories and symbolic links
 *   - Handles deep paths (e.g., 'a/b/c/d/e/f/g/h/i/j/file.txt')
 *   - Supports special characters including Unicode (e.g., '文件.txt')
 *   - Normalizes paths automatically (e.g., './foo/../bar' → 'bar')
 *
 * @returns {Promise<boolean>} A promise that resolves to:
 *   - `true` if all paths exist and are accessible
 *   - `false` if:
 *     - Any path doesn't exist
 *     - Any path is empty, null, or undefined
 *     - No paths are provided
 *     - A symbolic link exists but its target doesn't
 *
 * @throws {Error} If any path contains glob patterns (*)
 *
 * @example
 * ```typescript
 * // Files and directories
 * await isExist('file.txt')              //=> true
 * await isExist('dir/')                  //=> true
 * await isExist('non-existent')          //=> false
 *
 * // Multiple paths
 * await isExist('config.json', 'data/')   //=> true if both exist
 * await isExist(['src/', 'package.json']) //=> true if all exist
 * await isExist('readme.md', ['src/'])    //=> true if all exist
 *
 * // Special cases
 * await isExist('./foo/../bar')          //=> same as isExist('bar')
 * await isExist('深层/文件.txt')           //=> supports Unicode
 * await isExist('')                      //=> false
 * await isExist()                        //=> false
 * await isExist(['valid.txt', ''])       //=> false
 * await isExist('src/*.js')              //=> throws Error
 *
 * // Symbolic links (Unix-like systems)
 * await isExist('link')                  //=> true if link and target exist
 * await isExist('broken-link')           //=> false if target doesn't exist
 * ```
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
