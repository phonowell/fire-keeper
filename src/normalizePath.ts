import path from 'path'

import home from './home'
import root from './root'
import trimEnd from './trimEnd'

/**
 * Normalizes file system paths with enhanced handling of special cases
 * @param input Path string to normalize
 * @returns Normalized absolute path string, or empty string for invalid inputs
 *
 * @example Basic path normalization
 * ```ts
 * normalizePath('./src/file.txt')
 * //=> '/home/project/src/file.txt'
 *
 * normalizePath('~/documents')
 * //=> '/home/user/documents'
 * ```
 *
 * @example Special cases handling
 * ```ts
 * // Parent directory navigation
 * normalizePath('../config')
 * //=> '/home/config'
 *
 * // Ignore pattern
 * normalizePath('!./ignored')
 * //=> '!/home/project/ignored'
 *
 * // Unicode paths
 * normalizePath('./测试/路径')
 * //=> '/home/project/测试/路径'
 * ```
 *
 * Features:
 * - Converts relative paths to absolute paths
 * - Expands '~' to user home directory
 * - Normalizes path separators to forward slashes
 * - Preserves ignore patterns (paths starting with '!')
 * - Handles Unicode characters in paths
 * - Resolves parent directory references (..)
 * - Returns empty string for invalid inputs
 */
const normalizePath = (input: string) => {
  if (typeof input !== 'string') return ''
  if (!input.trim()) return ''

  // ignore?
  const isIgnored = input.startsWith('!')
  let _source = isIgnored ? input.slice(1) : input

  // replace . & ~
  _source = _source.replace(/\.{2}/g, '__parent_directory__')
  if (_source.startsWith('.')) _source = _source.replace(/\./u, root())
  else if (_source.startsWith('~')) _source = _source.replace(/~/u, home())
  _source = _source.replace(/__parent_directory__/g, '..')

  // replace ../ to ./../ at start
  if (_source.startsWith('..')) _source = `${root()}/${_source}`

  // normalize
  _source = path.normalize(_source).replace(/\\/g, '/')

  // absolute
  if (!path.isAbsolute(_source)) _source = `${root()}/${_source}`

  // ignore?
  if (isIgnored) _source = `!${_source}`

  return trimEnd(_source, '/')
}

export default normalizePath
