import echo from './echo.js'
import glob from './glob.js'
import read from './read.js'
import remove from './remove.js'
import runConcurrent from './runConcurrent.js'
import toArray from './toArray.js'
import wrapList from './wrapList.js'
import write from './write.js'

type Options = {
  concurrency?: number
}

/**
 * Recovers files from their backup versions (.bak files)
 * @param source - File path(s) to recover (without .bak extension), supports glob patterns
 * @param options - Recovery options
 * @param {number} [options.concurrency=5] - Maximum concurrent file operations
 * @returns Promise<void> Resolves when all recoveries complete
 *
 * @example
 * ```ts
 * await recover(['config.json', 'data.txt']) // Recovers from .bak files
 * await recover('*.txt', { concurrency: 3 }) // Processes max 3 files at once
 * ```
 */
const recover = async (
  source: string | string[],
  { concurrency = 5 }: Options = {},
): Promise<void> => {
  const listSource = await glob(
    toArray(source).map((src) => `${src}.bak`),
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
    listSource.map((src) => () => child(src)),
  )

  echo('recover', `recovered ${wrapList(source)}`)
}

const child = async (source: string) => {
  const content = await read(source)
  await write(source.replace('.bak', ''), content)
  await remove(source)
}

export default recover
