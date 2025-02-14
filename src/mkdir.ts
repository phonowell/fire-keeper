import fse from 'fs-extra'

import echo from './echo'
import normalizePath from './normalizePath'
import toArray from './toArray'
import wrapList from './wrapList'

/**
 * Create directories.
 * @param source The source directories.
 * @returns The promise.
 * @example
 * ```
 * await mkdir('dir')
 * await mkdir(['dir1', 'dir2'])
 * ```
 */
const mkdir = async (source: string | string[]) => {
  if (!source) throw new Error('mkdir/error: empty source')

  const listSource = toArray(source).map(normalizePath)
  for (const src of listSource) {
    await fse.ensureDir(src)
  }

  echo('file', `created ${wrapList(source)}`)
}

export default mkdir
