import path from 'path'

import home from './home.js'
import root from './root.js'
import trimEnd from './trimEnd.js'

/**
 * Normalizes file system paths to absolute paths with special handling
 * @param input - Path string to normalize (supports ~, ./, ../, and ! prefix)
 * @returns Normalized absolute path, empty string for invalid inputs
 *
 * @example
 * normalizePath('./src') // => '/project/src'
 * normalizePath('~/docs') // => '/home/user/docs'
 * normalizePath('!./ignore') // => '!/project/ignore'
 */
const normalizePath = (input: string) => {
  if (typeof input !== 'string') return ''
  if (!input.trim()) return ''

  // ignore?
  const isIgnored = input.startsWith('!')
  let result = isIgnored ? input.slice(1) : input

  // replace . & ~
  result = result.replace(/\.{2}/g, '__parent_directory__')
  if (result.startsWith('.')) result = result.replace(/\./u, root())
  else if (result.startsWith('~')) result = result.replace(/~/u, home())
  result = result.replace(/__parent_directory__/g, '..')

  // replace ../ to ./../ at start
  if (result.startsWith('..')) result = `${root()}/${result}`

  // \\ -> /
  result = path.normalize(result).replace(/\\/g, '/')

  // absolute
  if (!path.isAbsolute(result)) result = `${root()}/${result}`

  // ignore?
  if (isIgnored) result = `!${result}`

  return trimEnd(result, '/')
}

export default normalizePath
