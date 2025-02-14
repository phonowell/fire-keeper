import fse from 'fs-extra'

import echo from './echo'
import normalizePath from './normalizePath'

/**
 * Create a symbolic link.
 * @param source A source file or directory.
 * @param target A target file or directory.
 * @returns The promise.
 * @example
 * ```
 * await link('file.txt', 'link.txt')
 * ```
 */
const link = async (source: string, target: string) => {
  const _source = normalizePath(source)
  const _target = normalizePath(target)
  await fse.ensureSymlink(_source, _target)

  echo('file', `linked '${source}' to '${target}'`)
}

export default link
