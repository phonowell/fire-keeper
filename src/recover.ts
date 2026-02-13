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
  echo?: boolean
}

/**
 * Recover files from their .bak backup versions
 * @param source - File path(s) to recover (without .bak extension)
 * @param options - Configuration with concurrency setting
 * @example
 * await recover('config.json')        // Restores from config.json.bak
 * await recover(['*.txt'], { concurrency: 2 })
 */
const recover = async (
  source: string | string[],
  { concurrency = 5, echo: shouldEcho = true }: Options = {},
): Promise<void> => {
  const listSource = await glob(
    toArray(source).map((src) => `${src}.bak`),
    { onlyFiles: true },
  )

  if (!listSource.length) {
    if (shouldEcho)
      echo('recover', `no files found matching **${wrapList(source)}**`)

    return
  }

  await runConcurrent(
    concurrency,
    listSource.map((src) => () => child(src, shouldEcho)),
  )

  if (shouldEcho) echo('recover', `recovered **${wrapList(source)}**`)
}

const child = async (source: string, shouldEcho: boolean) => {
  const content = await read(source, { echo: shouldEcho })
  const targetPath = source.replace('.bak', '')
  await write(targetPath, content, undefined, { echo: shouldEcho })
  await remove(source, { echo: shouldEcho })
}

export default recover
