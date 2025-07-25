import { getFilename } from '../src/index.js'

const a = () => {
  if (typeof getFilename !== 'function')
    throw new Error('getFilename function not found')
}
a.description = 'function exists'

const b = () => {
  const tests = [
    ['file.txt', 'file.txt'],
    ['path/to/file.txt', 'file.txt'],
    ['C:/path/to/file.txt', 'file.txt'],
    ['/absolute/path/file.txt', 'file.txt'],
    ['./relative/path/file.txt', 'file.txt'],
  ]

  for (const [input, expected] of tests) {
    const result = getFilename(input)
    if (result !== expected)
      throw new Error(`filename extraction failed for ${input}`)
  }
}
b.description = 'extracts basic filenames'

const c = () => {
  const tests = [
    ['path\\to\\file.txt', 'file.txt'],
    ['path/to/file.txt', 'file.txt'],
    ['path\\to/file.txt', 'file.txt'],
    ['path/to\\file.txt', 'file.txt'],
  ]

  for (const [input, expected] of tests) {
    const result = getFilename(input)
    if (result !== expected)
      throw new Error(`separator handling failed for ${input}`)
  }
}
c.description = 'handles path separators'

const d = () => {
  const tests = [
    ['file', 'file'],
    ['path/to/file', 'file'],
    ['.hidden', '.hidden'],
    ['path/to/.hidden', '.hidden'],
  ]

  for (const [input, expected] of tests) {
    const result = getFilename(input)
    if (result !== expected)
      throw new Error(`extension-less handling failed for ${input}`)
  }
}
d.description = 'handles files without extensions'

const e = () => {
  const tests = [
    ['file with spaces.txt', 'file with spaces.txt'],
    ['file.with.dots.txt', 'file.with.dots.txt'],
    ['$special@chars#.txt', '$special@chars#.txt'],
    ['français.txt', 'français.txt'],
    ['中文文件.txt', '中文文件.txt'],
    ['🌟.txt', '🌟.txt'],
  ]

  for (const [input, expected] of tests) {
    const result = getFilename(input)
    if (result !== expected)
      throw new Error(`special filename handling failed for ${input}`)
  }
}
e.description = 'handles special filenames'

const f = () => {
  try {
    getFilename('')
    throw new Error('empty input should throw error')
  } catch (err) {
    if (!(err instanceof Error) || !err.message.includes('empty input'))
      throw new Error('unexpected error for empty input')
  }
}
f.description = 'handles empty input errors'

const g = () => {
  const tests = [
    ['.', '.'],
    ['..', '..'],
    ['/./', '.'],
    ['/../', '..'],
    ['dir/', 'dir'],
    ['path/to/dir/', 'dir'],
  ]

  for (const [input, expected] of tests) {
    const result = getFilename(input)
    if (result !== expected)
      throw new Error(`directory/dot path handling failed for ${input}`)
  }
}
g.description = 'handles directory paths and dots'

const h = () => {
  const tests = [
    ['file.tar.gz', 'file.tar.gz'],
    ['file.test.js.map', 'file.test.js.map'],
    ['.npmrc', '.npmrc'],
    ['file.min.js', 'file.min.js'],
    ['file.d.ts', 'file.d.ts'],
    ['http://example.com/file.txt', 'file.txt'],
    ['file:///C:/path/file.txt', 'file.txt'],
    ['File.TXT', 'File.TXT'],
    ['path/to/UPPERCASE.txt', 'UPPERCASE.txt'],
    ['path/to/file with spaces.txt', 'file with spaces.txt'],
    ['$special@chars#.txt', '$special@chars#.txt'],
    ['中文文件.txt', '中文文件.txt'],
    ['🌟.txt', '🌟.txt'],
  ]

  for (const [input, expected] of tests) {
    const result = getFilename(input)
    if (result !== expected)
      throw new Error(`complex filename handling failed for ${input}`)
  }
}
h.description = 'handles complex filenames and extensions'

export { a, b, c, d, e, f, g, h }
