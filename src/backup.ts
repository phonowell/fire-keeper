import copy from './copy'
import echo from './echo'
import glob from './glob'
import wrapList from './wrapList'

// function

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
  for (const src of listSource) {
    await copy(src, '', filename => `${filename}.bak`)
  }
  echo('backup', `backed up ${wrapList(source)}`)
}

// export
export default backup
