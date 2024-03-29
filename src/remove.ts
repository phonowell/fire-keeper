import fse from 'fs-extra'

import echo from './echo'
import glob from './glob'
import wrapList from './wrapList'

// function

/**
 * Remove files or directories.
 * @param source A source file or directory.
 * @returns The promise.
 * @example
 * ```
 * await remove('file.txt')
 * await remove(['file1.txt', 'file2.txt'])
 * ```
 */
const remove = async (source: string | string[]) => {
  const listSource = await glob(source, { onlyFiles: false })
  for (const src of listSource) {
    await fse.remove(src)
  }
  echo('remove', `removed ${wrapList(source)}`)
}

// export
export default remove
