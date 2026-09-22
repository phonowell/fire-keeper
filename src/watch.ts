import { watch as w } from 'chokidar'

import echo from './echo.js'
import glob from './glob.js'
import normalizePath from './normalizePath.js'
import toArray from './toArray.js'

type Options = {
  debounce?: number
  echo?: boolean
}

const EVENTS = ['change'] as const

const GLOB_CHARS = /[*?{[!]/

const debounce = <T extends unknown[]>(fn: (...args: T) => void, delay: number) => {
  let timer: NodeJS.Timeout | undefined
  return (...args: T) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Watch files/directories for changes with debounced callback
 * @param listSource - Paths to watch; glob patterns are resolved once at start
 * @param callback - Function called on changes with normalized path
 * @param options - { debounce?, echo? }
 * @returns Function to close the watcher
 * @example
 * watch('src', path => console.log('Changed:', path))
 * const stop = watch(['file1.js'], path => {}, { debounce: 500 })
 */
const watch = (
  listSource: string | string[],
  callback: (path: string) => void,
  { debounce: debounceMs = 1e3, echo: shouldEcho = true }: Options = {},
) => {
  const cb = debounceMs > 0 ? debounce(callback, debounceMs) : callback

  const literals: string[] = []
  const patterns: string[] = []
  for (const item of toArray(listSource)) {
    if (typeof item !== 'string' || !item || item.startsWith('!')) continue
    ;(GLOB_CHARS.test(item) ? patterns : literals).push(item)
  }

  const watcher = w(literals)

  if (patterns.length) {
    glob(patterns, { onlyFiles: false })
      .then((list) => watcher.add(list))
      .catch((error: Error) => {
        if (shouldEcho) echo('watch', `Error resolving watch patterns: ${error.message}`)
      })
  }

  watcher.on('error', (error) => {
    if (shouldEcho) {
      echo('watch', `Error watching files: ${(error as unknown as Error).message}`)
    }
  })

  EVENTS.forEach((event) => {
    watcher.on(event, (path: string) => {
      cb(normalizePath(path))
    })
  })

  return () => watcher.close()
}

export default watch
