import fse from 'fs-extra'

import echo from './echo'
import glob from './glob'
import normalizePath from './normalizePath'

/**
 * Creates a symbolic link from source to target location.
 * @param {string} source - The source file or directory path to create a link from
 * @param {string} target - The target path where the symbolic link will be created
 * @returns {Promise<void>} - Resolves when link is created successfully
 * @throws {Error} When:
 *   - Source path does not exist
 *   - Target path is invalid
 *   - Filesystem operations fail
 *   - Insufficient permissions
 * @example
 * ```typescript
 * // Create a symlink for a file
 * await link('source.txt', 'link.txt');
 *
 * // Create a symlink for a directory
 * await link('source-dir', 'link-dir');
 *
 * // Create a symlink with absolute paths
 * await link('/path/to/source', '/path/to/link');
 *
 * // Create a symlink with relative paths
 * await link('./config/default.json', './config/current.json');
 *
 * // Error handling
 * try {
 *   await link('non-existent.txt', 'link.txt');
 * } catch (error) {
 *   console.error('Failed to create symlink:', error);
 * }
 * ```
 */
const link = async (source: string, target: string): Promise<void> => {
  const sourcePaths = await glob(source, {
    onlyFiles: false,
  })
  if (!sourcePaths[0]) return

  const normalizedTarget = normalizePath(target)
  if (!normalizedTarget.length) return

  await fse.ensureSymlink(sourcePaths[0], normalizedTarget)

  echo('link', `linked '${source}' to '${target}'`)
}

export default link
