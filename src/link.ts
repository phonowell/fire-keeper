import fse from 'fs-extra'

import echo from './echo'
import normalizePath from './normalizePath'
import glob from './glob'

/**
 * Creates a symbolic link from source to target location.
 *
 * @param source - The source file or directory path to create a link from
 * @param target - The target path where the symbolic link will be created
 * @returns Promise<boolean> - Returns true if link was created successfully, false if validation fails
 *
 * @throws {Error} When filesystem operations fail
 *
 * @example
 * ```typescript
 * // Create a symlink for a file
 * await link('source.txt', 'link.txt');
 *
 * // Create a symlink for a directory
 * await link('source-dir', 'link-dir');
 * ```
 */
const link = async (source: string, target: string): Promise<boolean> => {
  const sourcePaths = await glob(source, {
    onlyFiles: false,
  })
  if (!sourcePaths[0]) return false

  const normalizedTarget = normalizePath(target)
  if (!normalizedTarget.length) return false

  await fse.ensureSymlink(sourcePaths[0], normalizedTarget)

  echo('file', `linked '${source}' to '${target}'`)
  return true
}

export default link
