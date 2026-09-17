import type { Stats } from 'node:fs'

import fse from 'fs-extra'

import echo from './echo.js'
import glob from './glob.js'
import wrapList from './wrapList.js'

type Options = {
  echo?: boolean
}

/**
 * Get file/directory status information
 * @param source - File path, directory path, or glob pattern
 * @returns Promise resolving to fs.Stats object or null if not found
 * @example
 * const stats = await stat('file.txt')
 * if (stats?.isFile()) console.log(`Size: ${stats.size}`)
 */
const stat = async (
  source: string,
  { echo: shouldEcho = true }: Options = {},
): Promise<Stats | null> => {
  const listSource = await glob(source, { onlyFiles: false })

  const filePath = listSource.at(0)
  if (!filePath) {
    if (shouldEcho) echo('stat', `**${wrapList(source)}** not found`)

    return null
  }

  return fse.stat(filePath)
}

export default stat
