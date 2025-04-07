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
 * Preserves directory structure, file content (including binary files), and supports special characters in filenames.
 *
 * @param source - A file path or glob pattern(s) to backup. Can be a single string or array of paths.
 * @param options - Backup configuration options
 * @param options.concurrency - Maximum number of concurrent backup operations (default: 5)
 * @throws {Error} If any backup operation fails or if source files cannot be accessed
 * @returns Promise that resolves when all backups are complete. If no files match the pattern, resolves without error.
 *
 * @example
 * // Backup a single file
 * backup('file.txt')
 * // Result: Creates file.txt.bak
 *
 * // Backup multiple files with pattern
 * backup(['src/*.ts', 'src/utils/*.ts'])
 * // Result: Creates .bak files preserving directory structure
 *
 * // Backup specific files
 * backup(['file1.txt', 'data/file2.bin'])
 * // Result: Creates file1.txt.bak and data/file2.bin.bak
 *
 * // Backup with custom concurrency
 * backup('*.txt', { concurrency: 2 })
 * // Result: Processes 2 files at a time
 *
 * // Supports special characters and non-ASCII filenames
 * backup(['特殊文件.txt', 'file!@#.dat'])
 * // Result: Creates 特殊文件.txt.bak and file!@#.dat.bak
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
