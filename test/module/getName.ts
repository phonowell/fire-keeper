import { $ } from '..'

// function

function a() {
  const source = '~/Downloads/test.txt'
  const { basename, dirname, extname, filename } = $.getName(source)

  if (basename !== 'test') throw new Error('1')
  if (dirname !== '~/Downloads') throw new Error('2')
  if (extname !== '.txt') throw new Error('3')
  if (filename !== 'test.txt') throw new Error('4')
}
a.description = 'default'

function b() {
  const source = 'C:\\Users\\mimiko\\Project\\fire-keeper\\readme.md'
  const { basename, dirname, extname, filename } = $.getName(source)

  if (basename !== 'readme') throw new Error('1')
  if (dirname !== 'C:/Users/mimiko/Project/fire-keeper') throw new Error('2')
  if (extname !== '.md') throw new Error('3')
  if (filename !== 'readme.md') throw new Error('4')
}
b.description = '@windows'

// export
export {
  a,
  b
}