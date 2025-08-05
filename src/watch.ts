import { watch as w } from 'chokidar'
import { debounce } from 'radash'

import normalizePath from './normalizePath.js'

type Options = {
  debounce?: number
}

const EVENTS = ['change'] as const

/**
 * Watch files or directories for changes and execute a callback when changes occur.
 * @param listSource Single path or array of paths to watch. Note: glob patterns are NOT supported
 * in chokidar v4+. Use specific file paths or directory paths only.
 * @param callback Function called with the normalized path when changes are detected
 * @param options Configuration options
 * @param options.debounce Time in milliseconds to debounce callback (default: 1000)
 * @returns Function to close the watcher
 * @example
 * // Watch specific directories (recommended)
 * watch(['src', 'config'], path => console.log(`Changed: ${path}`), { debounce: 500 })
 *
 * // Watch a single directory
 * watch('src', path => console.log(`Changed: ${path}`))
 *
 * // Watch specific files
 * watch(['file1.js', 'file2.js'], path => console.log(`Changed: ${path}`))
 */
const watch = (
  listSource: string | string[],
  callback: (path: string) => void,
  options: Options = {
    debounce: 1e3,
  },
) => {
  const cb =
    options.debounce !== undefined && options.debounce > 0
      ? debounce(
          {
            delay: options.debounce,
          },
          callback,
        )
      : callback

  const watcher = w(listSource)
  watcher.on('error', (error) => {
    console.error('Error watching files:', error)
  })

  EVENTS.forEach((event) => {
    watcher.on(event, (path: string) => {
      cb(normalizePath(path))
    })
  })

  return () => watcher.close()
}

export default watch
