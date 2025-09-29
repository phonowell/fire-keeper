import path from 'path'

import home from './home.js'
import root from './root.js'
import trimEnd from './trimEnd.js'

/**
 * Normalize file paths to absolute paths with special handling
 * @param input - Path string (supports ~, ./, ../, and ! prefix)
 * @returns Normalized absolute path or empty string if invalid
 * @example
 * normalizePath('./src')     // '/project/src'
 * normalizePath('~/docs')    // '/home/user/docs'
 */
const normalizePath = (input: string) => {
  if (typeof input !== 'string' || !input.trim()) return ''

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
