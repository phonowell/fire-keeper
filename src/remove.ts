import fse from 'fs-extra'

import echo from './echo.js'
import glob from './glob.js'
import runConcurrent from './runConcurrent.js'
import wrapList from './wrapList.js'

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
 * ```ts
 * remove('temp/file.txt')
 * remove(['logs/error.log', 'cache/'], { concurrency: 3 })
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
