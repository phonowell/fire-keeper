import fs from 'fs'

import echo from './echo'
import getDirname from './getDirname'
import normalizePath from './normalizePath'

/**
 * Rename a file or directory.
 * @param source A source file or directory.
 * @param target A target file or directory.
 * @returns The promise.
 * @example
 * ```
 * await rename('file.txt', 'file.bak')
 * ```
 */
const rename = async (source: string, target: string) => {
  const src = normalizePath(source)
  await new Promise((resolve, reject) =>
    fs.rename(src, `${getDirname(src)}/${target}`, err => {
      if (err) reject(err)
      else resolve(undefined)
    }),
  )
  echo('file', `renamed '${source}' as '${target}'`)
}

export default rename
