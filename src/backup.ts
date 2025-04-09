import copy from './copy'
import echo from './echo'
import glob from './glob'
import wrapList from './wrapList'

type Options = {
  concurrency?: number
}

/**
 * Creates .bak copies of specified files in their original directories
 * @param source - File path(s) or glob pattern(s) to backup
 * @param options - Backup configuration
 * @param options.concurrency - Max concurrent operations (default: 5)
 * @throws {Error} If backup operations fail
 * @example
 * backup('file.txt') // Creates file.txt.bak
 * backup(['src/*.ts'], { concurrency: 2 }) // Backs up 2 files at a time
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
