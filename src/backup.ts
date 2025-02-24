import copy from './copy'
import echo from './echo'
import glob from './glob'
import wrapList from './wrapList'

type Options = {
  concurrency?: number
}

/**
 * Backs up files by creating .bak copies.
 * For each source file, creates a copy with '.bak' extension in the same directory.
 *
 * @param source - A file path or glob pattern(s) to backup. Can be a single string or array of paths.
 * @param options - Backup configuration options
 * @param options.concurrency - Maximum number of concurrent backup operations (default: 5)
 * @throws {Error} If any backup operation fails or if source files cannot be accessed
 * @returns Promise that resolves when all backups are complete
 *
 * @example
 * ```typescript
 * // Backup a single file
 * await backup('file.txt')
 * // Result: Creates file.txt.bak
 *
 * // Backup multiple files
 * await backup(['file1.txt', 'file2.txt'])
 * // Result: Creates file1.txt.bak and file2.txt.bak
 *
 * // Backup with custom concurrency
 * await backup('*.txt', { concurrency: 2 })
 * // Result: Processes 2 files at a time
 * ```
 */
const backup = async (
  source: string | string[],
  { concurrency = 5 }: Options = {},
): Promise<void> => {
  const listSource = await glob(source, {
    onlyFiles: true,
  })
  if (!listSource.length) {
    echo('backup', `no files found matching ${wrapList(source)}`)
    return
  }

  await copy(listSource, '', {
    concurrency,
    filename: (filename) => `${filename}.bak`,
  })

  echo('backup', `backed up ${wrapList(source)}`)
}

export default backup
