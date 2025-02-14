import fs from 'fs'

import echo from './echo'
import isExist from './isExist'
import normalizePath from './normalizePath'
import wrapList from './wrapList'

/**
 * Get the file status.
 * @param source A source file or directory.
 * @returns The promise with the file status.
 * @example
 * ```
 * await stat('file.txt')
 * ```
 */
const stat = async (source: string): Promise<fs.Stats | null> => {
  const _source = normalizePath(source)

  if (!(await isExist(_source))) {
    echo('file', `${wrapList(_source)} not existed`)
    return null
  }

  return new Promise(resolve => {
    fs.stat(_source, (err, stat) => {
      if (err) throw err
      resolve(stat)
    })
  })
}

export default stat
