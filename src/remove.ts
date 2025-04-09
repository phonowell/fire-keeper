import fse from 'fs-extra'

import echo from './echo'
import glob from './glob'
import runConcurrent from './runConcurrent'
import wrapList from './wrapList'

type Options = {
  concurrency?: number
}

/**
 * Removes files and directories with pattern matching support
 * @param {string | string[]} source - Path(s) to remove, can be files, directories, or glob patterns
 * @param {Object} [options] - Configuration options
 * @param {number} [options.concurrency=5] - Maximum concurrent remove operations
 * @returns {Promise<void>} Resolves when all removals complete
 *
 * @example
 * // Remove a single file
 * remove('temp/file.txt')
 *
 * @example
 * // Remove multiple paths
 * remove(['logs/error.log', 'cache/temp'])
 *
 * @example
 * // Remove with custom concurrency
 * remove('build/', { concurrency: 3 })
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
