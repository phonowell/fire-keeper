import echo from './echo'
import glob from './glob'
import read from './read'
import remove from './remove'
import toArray from './toArray'
import wrapList from './wrapList'
import write from './write'

type Options = {
  isConcurrent?: boolean
}

/**
 * Recovers files from their backup versions (.bak files).
 * @param source - A single file/directory path or an array of paths to recover
 * @param options - Recovery options
 * @param options.isConcurrent - Whether to process files concurrently (default: true)
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
 * // Recover files sequentially
 * await recover('file.txt', { isConcurrent: false })
 * ```
 */
const recover = async (
  source: string | string[],
  { isConcurrent = true }: Options = {},
): Promise<void> => {
  const listSource = await glob(toArray(source).map(src => `${src}.bak`))
  if (!listSource.length) {
    echo('recover', `no files found matching ${wrapList(source)}`)
    return
  }

  if (isConcurrent) await Promise.all(listSource.map(src => child(src)))
  else for (const src of listSource) await child(src)

  echo('recover', `recovered ${wrapList(source)}`)
}

const child = async (source: string) => {
  const content = await read(source)
  await write(source.replace('.bak', ''), content)
  await remove(source)
}

export default recover
