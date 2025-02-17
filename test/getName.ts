import { $ } from './index'

const a = () => {
  const source = '~/Downloads/test.txt'
  const { basename, dirname, extname, filename } = $.getName(source)

  if (basename !== 'test') throw new Error('basename mismatch')
  if (dirname !== '~/Downloads') throw new Error('dirname mismatch')
  if (extname !== '.txt') throw new Error('extname mismatch')
  if (filename !== 'test.txt') throw new Error('filename mismatch')
}
a.description = 'parses Unix-style paths'

export { a }
