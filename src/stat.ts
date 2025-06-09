import fs from 'fs'

import echo from './echo.js'
import glob from './glob.js'
import wrapList from './wrapList.js'

/**
 * Get the file status of a file, directory, or glob pattern.
 * @param source A file path, directory path, or glob pattern.
 * @returns Promise that resolves with:
 *          - fs.Stats object if the file exists (resolves symlinks)
 *          - null if the file is not found
 * @throws {Error} If there's an error accessing the file (e.g., invalid input)
 * @example
 * ```
 * const stats = await stat('file.txt')
 * if (stats?.isFile()) console.log(`Size: ${stats.size}`)
 *
 * // Also works with directories and glob patterns
 * const dirStats = await stat('directory')
 * const fileStats = await stat('src/*.ts')
 * ```
 */
const stat = async (source: string): Promise<fs.Stats | null> => {
  const listSource = await glob(source, {
    onlyFiles: false,
  })
  if (!listSource.length) {
    echo('stat', `${wrapList(source)} not found`)
    return null
  }

  return new Promise((resolve) => {
    fs.stat(listSource[0], (err, stat) => {
      if (err) throw err
      resolve(stat)
    })
  })
}

export default stat
