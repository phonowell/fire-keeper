import path from 'path'

import home from './home'
import root from './root'
import trimEnd from './trimEnd'

/**
 * Normalize path
 * @param input string
 * @returns string
 * @example
 * ```
 * const np = normalizePath('./src/file.txt')
 * //=> '/home/runner/work/project/project/src/file.txt'
 * ```
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
