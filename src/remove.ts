import fse from 'fs-extra'

import echo from './echo'
import glob from './glob'
import wrapList from './wrapList'

/**
 * Remove files or directories recursively.
 * @param source A file/directory path or array of paths to remove.
 * @returns Promise that resolves to true if any files were removed, false otherwise.
 * @throws {Error} If removal operation fails.
 *
 * @example Simple file removal
 * ```typescript
 * await remove('file.txt')
 * ```
 *
 * @example Multiple files removal
 * ```typescript
 * await remove(['file1.txt', 'file2.txt'])
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
const remove = async (source: string | string[]): Promise<boolean> => {
  const listSource = await glob(source, { onlyFiles: false })
  if (!listSource.length) return false

  for (const src of listSource) {
    await fse.remove(src)
  }

  echo('remove', `removed ${wrapList(source)}`)
  return true
}

export default remove
