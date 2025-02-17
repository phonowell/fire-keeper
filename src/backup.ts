import copy from './copy'
import echo from './echo'
import glob from './glob'
import wrapList from './wrapList'

/**
 * Backup files or directories.
 * @param source A source file or directory.
 * @returns The promise.
 * @example
 * ```
 * await backup('file.txt')
 * await backup(['file1.txt', 'file2.txt'])
 * ```
 */
const backup = async (source: string | string[]) => {
  const listSource = await glob(source)
  if (!listSource.length) {
    echo('backup', `no file found for ${wrapList(source)}`)
    return
  }

  for (const src of listSource) {
    await copy(src, '', filename => `${filename}.bak`)
  }
  echo('backup', `backed up ${wrapList(source)}`)
}

export default backup
