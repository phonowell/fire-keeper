import { watch as w } from 'chokidar'
import { debounce } from 'radash'

import normalizePath from './normalizePath.js'

type Options = {
  debounce?: number
}

const EVENTS = ['change'] as const

/**
 * Watch files/directories for changes with debounced callback
 * @param listSource - Paths to watch (no glob patterns in chokidar v4+)
 * @param callback - Function called on changes with normalized path
 * @param options - Configuration with debounce timing
 * @returns Function to close the watcher
 * @example
 * watch('src', path => console.log('Changed:', path))
 * const stop = watch(['file1.js'], path => {}, { debounce: 500 })
 */
const watch = (
  listSource: string | string[],
  callback: (path: string) => void,
  { debounce: debounceMs = 1e3 }: Options = {},
) => {
  const cb =
    debounceMs > 0 ? debounce({ delay: debounceMs }, callback) : callback

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
