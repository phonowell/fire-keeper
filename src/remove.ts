import fse from 'fs-extra'

import echo from './echo'
import glob from './glob'
import runConcurrent from './runConcurrent'
import wrapList from './wrapList'

type Options = {
  concurrency?: number
}

/**
 * Remove files and directories with concurrent operation support.
 * Uses glob patterns to match files and supports removing multiple files in parallel.
 *
 * @param {string | string[]} source - Path(s) to remove. Can be:
 *   - Single file/directory path
 *   - Array of paths
 *   - Glob pattern(s)
 * @param {Object} [options] - Configuration options
 * @param {number} [options.concurrency=5] - Maximum concurrent remove operations
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // Remove single file
 * await remove('temp/file.txt')
 *
 * // Remove multiple paths
 * await remove([
 *   'temp/cache',
 *   'temp/logs'
 * ])
 *
 * // Remove using glob patterns
 * await remove('temp/+(*.js|*.map)')
 *
 * // Remove with custom concurrency
 * await remove(['large1.dat', 'large2.dat'], {
 *   concurrency: 2
 * })
 *
 * // Remove directory and its contents
 * await remove('build')
 * ```
 */
const remove = async (
  source: string | string[],
  { concurrency = 5 }: Options = {},
): Promise<void> => {
  const listSource = await glob(source, {
    onlyFiles: false,
  })
  if (!listSource.length) {
    echo('remove', `no files found matching ${wrapList(source)}`)
    return
  }

  await runConcurrent(
    concurrency,
    listSource.map((src) => () => fse.remove(src)),
  )

  echo('remove', `removed ${wrapList(source)}`)
}

export default remove
