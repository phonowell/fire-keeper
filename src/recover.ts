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
 * Recovers files from their backup versions (.bak files) with concurrent processing
 * @param source - File path(s) to recover (without .bak extension)
 * @param options - Recovery options
 * @param {number} [options.concurrency=5] - Maximum concurrent file operations
 *
 * @returns Promise<void> Resolves when all recoveries complete
 *
 * @example Single file recovery
 * ```ts
 * await recover('config.json')
 * //=> Recovers from config.json.bak
 * ```
 *
 * @example Multiple file recovery
 * ```ts
 * await recover([
 *   'config.json',
 *   'data.txt',
 *   'settings.yml'
 * ])
 * //=> Recovers all .bak files concurrently
 * ```
 *
 * @example Custom concurrency
 * ```ts
 * await recover('*.txt', {
 *   concurrency: 3
 * })
 * //=> Processes max 3 files at once
 * ```
 *
 * Features:
 * - Supports glob patterns
 * - Concurrent file processing
 * - Preserves file content
 * - Automatic cleanup of .bak files
 * - Progress reporting via echo
 *
 * Behavior:
 * - Missing backups: Skips silently
 * - Mixed sources: Recovers available backups
 * - Original exists: Gets overwritten
 * - After recovery: Removes .bak file
 *
 * Error handling:
 * - Non-existent backups: Reports via echo
 * - IO errors: Throws system errors
 * - Empty source list: Returns early
 * - Invalid paths: Reports via echo
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
