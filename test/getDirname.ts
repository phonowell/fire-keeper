import { getDirname } from '../src'

const a = () => {
  if (typeof getDirname !== 'function')
    throw new Error('getDirname function not found')
}
a.description = 'function exists'

const b = () => {
  // Test basic path dirname extraction
  const tests = [
    ['file.txt', '.'],
    ['path/to/file.txt', 'path/to'],
    ['./file.txt', '.'],
    ['../file.txt', '..'],
    ['/absolute/path/file.txt', '/absolute/path'],
  ]

  for (const [input, expected] of tests) {
    const result = getDirname(input)
    if (result !== expected)
      throw new Error(
        `dirname extraction failed for ${input}, got ${result}, expected ${expected}`,
      )
  }
}
b.description = 'extracts basic dirnames'

const c = () => {
  // Test Windows-style paths
  const tests = [
    ['C:\\path\\to\\file.txt', 'C:/path/to'],
    ['D:\\Program Files\\app\\file.txt', 'D:/Program Files/app'],
    ['\\\\network\\share\\file.txt', '//network/share'],
    ['C:\\Users\\user\\..\\file.txt', 'C:/Users/user/..'],
  ]

  for (const [input, expected] of tests) {
    const result = getDirname(input)
    if (result !== expected)
      throw new Error(
        `Windows path handling failed for ${input}, got ${result}, expected ${expected}`,
      )
  }
}
c.description = 'handles Windows paths'

const d = () => {
  // Test special characters and Unicode
  const tests = [
    ['path/with spaces/file.txt', 'path/with spaces'],
    ['special!@#$/chars/file.txt', 'special!@#$/chars'],
    ['文件夹/子文件夹/文件.txt', '文件夹/子文件夹'],
    ['path/with/🌟/file.txt', 'path/with/🌟'],
  ]

  for (const [input, expected] of tests) {
    const result = getDirname(input)
    if (result !== expected)
      throw new Error(`special character handling failed for ${input}`)
  }
}
d.description = 'handles special characters'

const e = () => {
  // Test empty and invalid inputs
  try {
    getDirname('')
    throw new Error('empty input should throw')
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('empty input'))
      throw new Error('wrong error for empty input')
  }

  // Whitespace is a valid input that returns "."
  const whitespaceResult = getDirname('   ')
  if (whitespaceResult !== '.')
    throw new Error(
      `whitespace input should return ".", got "${whitespaceResult}"`,
    )
}
e.description = 'handles invalid inputs'

const f = () => {
  // Test edge cases
  const tests = [
    ['.', '.'],
    ['..', '.'],
    ['/', '/'],
    ['./', '.'],
    ['../', '.'],
    ['//', '/'],
  ]

  for (const [input, expected] of tests) {
    const result = getDirname(input)
    if (result !== expected)
      throw new Error(
        `edge case handling failed for "${input}", got "${result}", expected "${expected}"`,
      )
  }
}
f.description = 'handles edge cases'

const g = () => {
  // Test URL-like paths
  const tests = [
    ['http://example.com/path/file.txt', 'http://example.com/path'],
    ['file:///root/path/file.txt', 'file:///root/path'],
    ['//server/share/file.txt', '//server/share'],
  ]

  for (const [input, expected] of tests) {
    const result = getDirname(input)
    if (result !== expected)
      throw new Error(`URL-like path handling failed for ${input}`)
  }
}
g.description = 'handles URL-like paths'

const h = () => {
  // Test relative paths and parent directory references
  const tests = [
    ['./path/to/file.txt', './path/to'],
    ['../path/to/file.txt', '../path/to'],
    ['path/../other/file.txt', 'path/../other'],
    ['./path/./to/file.txt', './path/./to'],
  ]

  for (const [input, expected] of tests) {
    const result = getDirname(input)
    if (result !== expected)
      throw new Error(`relative path handling failed for ${input}`)
  }
}
h.description = 'handles relative paths'

const i = () => {
  // Test paths with multiple extensions
  const tests = [
    ['path/to/file.tar.gz', 'path/to'],
    ['path/to/file.min.js.map', 'path/to'],
    ['path/archive.tar/file.txt', 'path/archive.tar'],
  ]

  for (const [input, expected] of tests) {
    const result = getDirname(input)
    if (result !== expected)
      throw new Error(`multiple extension handling failed for ${input}`)
  }
}
i.description = 'handles multiple extensions'

export { a, b, c, d, e, f, g, h, i }
