import fse from 'fs-extra'

import echo from './echo'
import glob from './glob'
import wrapList from './wrapList'
import runConcurrent from './runConcurrent'

type Options = {
  concurrency?: number
}

/**
 * Remove files or directories recursively.
 * @param source A file/directory path or array of paths to remove.
 * @param options Configuration options for removal.
 * @param options.concurrency Maximum number of concurrent operations. Defaults to 5.
 * @returns Promise that resolves when all files are removed.
 * @throws {Error} If a file/directory cannot be accessed or removed.
 * @throws {TypeError} If source parameter is invalid.
 *
 * @example Simple file removal
 * ```typescript
 * await remove('file.txt')
 * ```
 *
 * @example Multiple files removal with options
 * ```typescript
 * await remove(['file1.txt', 'file2.txt'], { concurrency: 3 })
 * ```
 *
 * @example Directory removal
 * ```typescript
 * await remove('directory/to/remove')
 * ```
 *
 * @example Using glob patterns
 * ```typescript
 * await remove('temp/*.log')
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
