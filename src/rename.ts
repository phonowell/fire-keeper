import fs from 'fs'

import echo from './echo.js'
import getDirname from './getDirname.js'
import normalizePath from './normalizePath.js'

/**
 * Rename a file or directory with path normalization
 * @param {string} source - Source path to rename (file, directory, or symlink)
 * @param {string} target - New name (not full path) for the source
 * @returns {Promise<void>} Resolves when rename completes
 *
 * @example
 * ```ts
 * rename('file.txt', 'backup.txt')
 * rename('src/', 'backup-src') // Preserves directory contents
 * ```
 *
 * @throws {Error} ENOENT (not found), EEXIST (target exists), EPERM (permission denied)
 */
const rename = async (source: string, target: string) => {
  const src = normalizePath(source)
  await new Promise((resolve, reject) =>
    fs.rename(src, `${getDirname(src)}/${target}`, (err) => {
      if (err) reject(err)
      else resolve(undefined)
    }),
  )
  echo('rename', `renamed '${source}' as '${target}'`)
}

export default rename
