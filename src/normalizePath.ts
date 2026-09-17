import path from 'node:path'

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

  // replace ~ & .
  if (result.startsWith('~')) result = `${home()}${result.slice(1)}`
  else if (result.startsWith('.')) result = `${root()}/${result}`

  // \\ -> /, resolve . & ..
  result = path.normalize(result).replace(/\\/g, '/')

  // absolute
  if (!path.isAbsolute(result)) result = `${root()}/${result}`

  // ignore?
  if (isIgnored) result = `!${result}`

  return trimEnd(result, '/')
}

export default normalizePath
