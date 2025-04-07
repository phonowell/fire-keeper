import { echo, wrapList } from 'fire-keeper'

import getDirname from './getDirname'
import glob from './glob'
import remove from './remove'

/**
 * Clean up files and directories, removing empty parent directories afterwards.
 * After removing specified files, checks if their containing directories are empty
 * and removes them if they are. Directory removal is smart - it won't remove
 * directories that still contain other files.
 *
 * @param {string | string[]} source - The path(s) to clean. Can be:
 *   - A single file/directory path
 *   - An array of paths
 *   - Glob pattern(s)
 * @returns {Promise<void>} Resolves when cleaning is complete. Safe to call on non-existent paths.
 *
 * @example
 * // Clean single file in empty directory (removes both)
 * await clean('temp/logs/debug.log')
 * // temp/logs and temp will be removed if empty
 *
 * // Clean file with sibling files (keeps directory)
 * await clean('logs/debug.log')
 * // Only removes debug.log if other files exist in logs/
 *
 * // Clean nested structure
 * await clean([
 *   'build/temp/cache.txt',
 *   'build/temp/logs/debug.log'
 * ])
 * // Removes files and empty parent dirs, preserves dirs with content
 *
 * // Clean using glob pattern
 * await clean('dist/*.map')
 * // Removes all .map files and their empty parent dirs
 *
 * // Safe with non-existent files
 * await clean('temp/missing.txt')
 * // No error if file doesn't exist
 */
const clean = async (source: string | string[]): Promise<void> => {
  const listSource = await glob(source, {
    onlyFiles: false,
  })
  if (!listSource.length) {
    echo('clean', `no files found matching ${wrapList(source)}`)
    return
  }

  await remove(source)

  const dirname = getDirname(listSource[0])
  if (
    (
      await glob(`${dirname}/**/*`, {
        onlyFiles: true,
      })
    ).length
  )
    return

  await remove(dirname)
}

export default clean
