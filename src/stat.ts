import fs from 'fs'

import echo from './echo.js'
import glob from './glob.js'
import wrapList from './wrapList.js'

/**
 * Get file/directory status information
 * @param source - File path, directory path, or glob pattern
 * @returns Promise resolving to fs.Stats object or null if not found
 * @example
 * const stats = await stat('file.txt')
 * if (stats?.isFile()) console.log(`Size: ${stats.size}`)
 */
const stat = async (source: string): Promise<fs.Stats | null> => {
  const listSource = await glob(source, { onlyFiles: false })

  if (!listSource.length) {
    echo('stat', `${wrapList(source)} not found`)
    return null
  }

  return new Promise((resolve, reject) => {
    fs.stat(listSource[0], (err, stat) => {
      if (err) reject(err)
      else resolve(stat)
    })
  })
}

export default stat
