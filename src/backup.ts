import copy from './copy'
import echo from './echo'
import glob from './glob'
import wrapList from './wrapList'

type Options = {
  isConcurrent?: boolean
}

/**
 * Backs up files or directories by creating .bak copies.
 *
 * @param source - A file path or array of paths to backup
 * @param options - Backup configuration options
 * @throws {Error} If any backup operation fails
 * @returns Promise that resolves when all backups are complete
 *
 * @example
 * ```typescript
 * // Backup a single file
 * await backup('file.txt')
 *
 * // Backup multiple files
 * await backup(['file1.txt', 'file2.txt'])
 *
 * // Backup with options
 * await backup('file.txt', { isConcurrent: false })
 * ```
 */
const backup = async (
  source: string | string[],
  { isConcurrent = true }: Options = {},
): Promise<void> => {
  const listSource = await glob(source)
  if (!listSource.length) {
    echo('backup', `no files found matching ${wrapList(source)}`)
    return
  }

  await copy(listSource, '', {
    filename: filename => `${filename}.bak`,
    isConcurrent,
  })

  echo('backup', `backed up ${wrapList(source)}`)
}

export default backup
