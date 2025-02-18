import echo from './echo'
import glob from './glob'
import read from './read'
import remove from './remove'
import runConcurrent from './runConcurrent'
import toArray from './toArray'
import wrapList from './wrapList'
import write from './write'

type Options = {
  concurrency?: number
}

/**
 * Recovers files from their backup versions (.bak files).
 * @param source - A single file path or an array of paths to recover
 * @param options - Recovery options
 * @param options.concurrency - Maximum number of concurrent file operations (default: 5)
 * @throws {Error} When file operations fail
 * @returns Promise<void>
 * @example
 * ```typescript
 * // Recover a single file
 * await recover('file.txt')
 *
 * // Recover multiple files
 * await recover(['file1.txt', 'file2.txt'])
 *
 * // Recover files with custom concurrency
 * await recover('file.txt', { concurrency: 3 })
 * ```
 */
const recover = async (
  source: string | string[],
  { concurrency = 5 }: Options = {},
): Promise<void> => {
  const listSource = await glob(
    toArray(source).map(src => `${src}.bak`),
    {
      onlyFiles: true,
    },
  )
  if (!listSource.length) {
    echo('recover', `no files found matching ${wrapList(source)}`)
    return
  }

  await runConcurrent(
    concurrency,
    listSource.map(src => () => child(src)),
  )

  echo('recover', `recovered ${wrapList(source)}`)
}

const child = async (source: string) => {
  const content = await read(source)
  await write(source.replace('.bak', ''), content)
  await remove(source)
}

export default recover
