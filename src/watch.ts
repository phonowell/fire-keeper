import { watch as w } from 'chokidar'
import { debounce } from 'radash'

import normalizePath from './normalizePath'

type Options = {
  debounce?: number
}

/**
 * Watch the file or directory.
 * @param listSource The file or directory to watch.
 * @param callback The callback to execute.
 * @param options The options.
 * @example
 * ```
 * watch('src', path => {
 *   console.log(path)
 * })
 * ```
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
