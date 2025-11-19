import fs from 'fs'

import echo from './echo.js'
import getDirname from './getDirname.js'
import normalizePath from './normalizePath.js'

/**
 * Rename a file or directory with path normalization
 * @param source - Source path to rename
 * @param target - New name (basename only, not full path)
 * @example
 * rename('old-file.txt', 'new-file.txt')
 * rename('src/', 'backup-src')  // Rename directory
 */
const rename = async (source: string, target: string) => {
  const src = normalizePath(source)
  const destPath = `${getDirname(src)}/${target}`

  await new Promise<void>((resolve, reject) =>
    fs.rename(src, destPath, (err) => {
      if (err) reject(err)
      else resolve()
    }),
  )

  echo('rename', `renamed **${source}** as **${target}**`)
}

export default rename
