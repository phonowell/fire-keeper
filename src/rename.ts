import fs from 'fs'

import echo from './echo'
import getDirname from './getDirname'
import normalizePath from './normalizePath'

/**
 * Rename a file or directory with path normalization
 * @param {string} source - Source path to rename (file, directory, or symlink)
 * @param {string} target - New name (not full path) for the source
 * @returns {Promise<void>} Resolves when rename completes
 *
 * @example
 * // Simple file rename
 * rename('file.txt', 'backup.txt')
 *
 * @example
 * // Directory rename with contents
 * rename('src/', 'backup-src')
 *
 * @example
 * // Unicode filename support
 * rename('文件.txt', '改名.txt')
 *
 * @example
 * // Path normalization
 * rename('./temp/../config.json', 'config.backup.json')
 *
 * Features:
 * - Preserves directory contents
 * - Handles symlinks (Unix)
 * - Supports Unicode paths
 * - Normalizes paths
 * - Preserves permissions
 *
 * Throws:
 * - ENOENT: Source not found
 * - EEXIST: Target exists
 * - EPERM: Permission denied
 * - EXDEV: Cross-device link
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
