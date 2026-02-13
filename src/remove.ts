import fse from 'fs-extra'

import echo from './echo.js'
import glob from './glob.js'
import normalizePath from './normalizePath.js'
import runConcurrent from './runConcurrent.js'
import toArray from './toArray.js'
import wrapList from './wrapList.js'

type Options = {
  concurrency?: number
  echo?: boolean
}

const listDirectSources = async (source: string | string[]) => {
  const result: string[] = []

  for (const item of toArray(source)) {
    if (typeof item !== 'string') continue

    const normalized = normalizePath(item)
    if (!normalized || normalized.startsWith('!')) continue

    try {
      await fse.lstat(normalized)
      result.push(normalized)
    } catch {
      continue
    }
  }

  return result
}

/**
 * Remove files and directories with glob pattern support
 * @param source - Path(s) to remove (files, directories, or patterns)
 * @param options - Configuration with concurrency setting
 * @example
 * remove('temp/file.txt')
 * remove(['logs/*.log', 'cache/'], { concurrency: 3 })
 */
const remove = async (
  source: string | string[],
  { concurrency = 5, echo: shouldEcho = true }: Options = {},
): Promise<void> => {
  const listSource = await glob(source, {
    onlyFiles: false,
    followSymbolicLinks: false,
  })
  const directSources = await listDirectSources(source)
  const targets = Array.from(new Set([...listSource, ...directSources]))

  if (!targets.length) {
    if (shouldEcho)
      echo('remove', `no files found matching **${wrapList(source)}**`)

    return
  }

  await runConcurrent(
    concurrency,
    targets.map((src) => () => fse.remove(src)),
  )

  if (shouldEcho) echo('remove', `removed **${wrapList(source)}**`)
}

export default remove
