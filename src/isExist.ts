import fse from 'fs-extra'

import normalizePath from './normalizePath'
import flatten from './flatten'

/**
 * Check if one or more paths exist in the filesystem.
 * @param {...(string | string[])} args - The paths to check. Can be single paths or arrays of paths
 * @returns {Promise<boolean>} A promise that resolves to:
 *   - `true` if all paths exist
 *   - `false` if any path doesn't exist or if no paths are provided
 * @throws {Error} If any path contains glob patterns (*)
 * @example
 * ```typescript
 * // Single file check
 * const exists = await isExist('file.txt');
 * //=> true
 *
 * // Multiple paths
 * const allExist = await isExist('config.json', 'data.json');
 * //=> true if both files exist
 *
 * // Array of paths
 * const filesExist = await isExist(['src/index.ts', 'package.json']);
 * //=> true if all files exist
 *
 * // Mixed usage
 * const mixed = await isExist('readme.md', ['src/lib', 'tests']);
 * //=> true if all paths exist
 *
 * // Invalid path with glob pattern
 * await isExist('src/*.ts'); // Throws Error: invalid path 'src/*.ts'
 *
 * // Empty or invalid input
 * const empty = await isExist();
 * //=> false
 *
 * const invalid = await isExist('');
 * //=> false
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
