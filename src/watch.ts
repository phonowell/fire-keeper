import { watch as w } from 'chokidar'
import { debounce } from 'radash'

import normalizePath from './normalizePath'

type Options = {
  debounce?: number
}

/**
 * Watch files or directories for changes and execute a callback when changes occur.
 * @param listSource Single path or array of paths to watch
 * @param callback Function called with the normalized path when changes are detected
 * @param options Configuration options
 * @param options.debounce Time in milliseconds to debounce callback (default: 1000)
 * @example
 * // Watch a single directory
 * watch('src', path => {
 *   console.log(path)
 * })
 *
 * // Watch multiple paths with custom debounce
 * watch(['src', 'config'], path => {
 *   console.log(`Changed: ${path}`)
 * }, { debounce: 500 })
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
  w(listSource).on('change', (path: string) => cb(normalizePath(path)))
}

export default watch
