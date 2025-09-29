import fse from 'fs-extra'

import echo from './echo.js'
import normalizePath from './normalizePath.js'
import runConcurrent from './runConcurrent.js'
import toArray from './toArray.js'
import wrapList from './wrapList.js'

type Options = {
  concurrency?: number
}

/**
 * Create directories recursively with concurrent support
 * @param source - Directory path(s) to create
 * @param options - Configuration with concurrency setting
 * @example
 * await mkdir('path/to/deep/dir')
 * await mkdir(['dir1', 'dir2'], { concurrency: 3 })
 */
const mkdir = async (
  source: string | string[],
  { concurrency = 5 }: Options = {},
): Promise<void> => {
  const patterns = toArray(source).map(normalizePath).filter(Boolean)
  if (!patterns.length) return

  await runConcurrent(
    concurrency,
    patterns.map((pattern) => () => fse.ensureDir(pattern)),
  )

  echo('mkdir', `created ${wrapList(source)}`)
}

export default mkdir
