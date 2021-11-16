import $home from './home'
import $path from 'path'
import $root from './root'
import $trimEnd from 'lodash/trimEnd'

// function

const main = (
  source: string,
): string => {

  // validate
  if (typeof source !== 'string') return ''
  if (!source) return ''

  // ignore?
  const isIgnored = source[0] === '!'
  let _source = isIgnored
    ? source.slice(1)
    : source

  // replace . & ~
  _source = _source.replace(/\.{2}/g, '__parent_directory__')
  if (_source[0] === '.') _source = _source.replace(/\./u, $root())
  else if (_source[0] === '~') _source = _source.replace(/~/u, $home())
  _source = _source.replace(/__parent_directory__/g, '..')

  // replace ../ to ./../ at start
  if (_source.startsWith('..')) _source = `${$root()}/${_source}`

  // normalize
  _source = $path.normalize(_source)
    .replace(/\\/g, '/')

  // absolute
  if (!$path.isAbsolute(_source)) _source = `${$root()}/${_source}`

  // ignore?
  if (isIgnored) _source = `!${_source}`

  return $trimEnd(_source, '/')
}

// export
export default main