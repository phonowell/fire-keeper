import chokidar from 'chokidar'
import debounce from 'lodash/debounce'
import normalizePath from './normalizePath'

// interface

type Options = {
  debounce?: number
}

// function

const main = (
  listSource: string | string[],
  callback: (path: string) => void,
  options: Options = {
    debounce: 1e3,
  }
) => {
  const cb = options.debounce !== undefined
    && options.debounce > 0
    ? debounce(callback, options.debounce)
    : callback
  chokidar.watch(listSource).on('change', (path) => cb(normalizePath(path)))
}

// export
export default main