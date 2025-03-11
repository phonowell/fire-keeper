import fs from 'fs'

import echo from './echo'
import glob from './glob'
import wrapList from './wrapList'

/**
 * Get the file status of a file or directory.
 * @param source A source file or directory path.
 * @returns Promise that resolves with:
 *          - fs.Stats object if the file exists
 *          - null if the file is not found
 * @throws {Error} If there's an error accessing the file
 * @example
 * ```typescript
 * try {
 *   const stats = await stat('file.txt')
 *   if (stats) {
 *     console.log(`File size: ${stats.size}`)
 *   }
 * } catch (err) {
 *   console.error('Error accessing file:', err)
 * }
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
