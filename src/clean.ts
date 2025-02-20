import { echo, wrapList } from 'fire-keeper'

import getDirname from './getDirname'
import glob from './glob'
import remove from './remove'

/**
 * Clean (remove) files or directories and their empty parent directories.
 * @param {string | string[]} source - A file path, directory path, or array of paths to clean
 * @returns {Promise<void>} Promise that resolves when cleaning is complete
 * @example
 * ```typescript
 * // Clean a single file
 * await clean('dist/bundle.js');
 *
 * // Clean multiple files
 * await clean(['temp/cache.txt', 'temp/logs.txt']);
 *
 * // Clean directory
 * await clean('build/');
 *
 * // Clean with glob pattern
 * await clean('dist/*.js');
 *
 * // Clean multiple patterns
 * await clean([
 *   'dist/*.js',
 *   'build/*.map'
 * ]);
 *
 * // Parent directory cleanup
 * // If temp/data/file.txt is the last file,
 * // temp/data will also be removed if empty
 * await clean('temp/data/file.txt');
 * ```
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
