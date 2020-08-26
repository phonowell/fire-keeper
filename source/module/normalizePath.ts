import $ from '..'
import _trimEnd from 'lodash/trimEnd'
import path from 'path'

// function

function main(source: string): string {

  // validate
  if (typeof source !== 'string') return ''
  if (!source) return ''

  // ignore?
  const isIgnored = source[0] === '!'
  if (isIgnored) source = source.slice(1)

  // replace . & ~
  source = source.replace(/\.{2}/g, '__parent_directory__')
  if (source[0] === '.') source = source.replace(/\./, $.root())
  else if (source[0] === '~') source = source.replace(/~/, $.home())
  source = source.replace(/__parent_directory__/g, '..')

  // replace ../ to ./../ at start
  if (source.startsWith('..')) source = `${$.root()}/${source}`

  // normalize
  source = path.normalize(source)
    .replace(/\\/g, '/')

  // absolute
  if (!path.isAbsolute(source))
    source = `${$.root()}/${source}`

  // ignore?
  if (isIgnored) source = `!${source}`

  return _trimEnd(source, '/')
}

// export
export default main