import { getBasename } from '../src/index.js'

const a = () => {
  if (typeof getBasename !== 'function')
    throw new Error('getBasename function not found')
}
a.description = 'function exists'

const b = () => {
  const tests = [
    ['file.txt', 'file'],
    ['path/to/document.pdf', 'document'],
    ['./script.js', 'script'],
    ['../style.css', 'style'],
    ['/absolute/path/config.json', 'config'],
  ]

  for (const [input, expected] of tests) {
    const result = getBasename(input)
    if (result !== expected) {
      throw new Error(
        `basename extraction failed for ${input}, got ${result}, expected ${expected}`,
      )
    }
  }
}
b.description = 'extracts basic basenames'

const c = () => {
  const tests = [
    ['archive.tar.gz', 'archive.tar'],
    ['script.test.js', 'script.test'],
    ['styles.min.css', 'styles.min'],
    ['data.json.bak', 'data.json'],
    ['file.d.ts', 'file.d'],
  ]

  for (const [input, expected] of tests) {
    const result = getBasename(input)
    if (result !== expected)
      throw new Error(`multiple extension handling failed for ${input}`)
  }
}
c.description = 'handles multiple extensions'

const d = () => {
  const tests = [
    ['.gitignore', '.gitignore'],
    ['.env', '.env'],
    ['.config/settings', 'settings'],
    ['.hidden/file.txt', 'file'],
    ['path/to/.local', '.local'],
  ]

  for (const [input, expected] of tests) {
    const result = getBasename(input)
    if (result !== expected)
      throw new Error(`hidden file handling failed for ${input}`)
  }
}
d.description = 'handles hidden files'

const e = () => {
  const tests = [
    ['file with spaces.txt', 'file with spaces'],
    ['special!@#$chars.doc', 'special!@#$chars'],
    ['path/to/file(1).txt', 'file(1)'],
    ['file_with_underscore.txt', 'file_with_underscore'],
    ['path/to/file-with-dashes.txt', 'file-with-dashes'],
  ]

  for (const [input, expected] of tests) {
    const result = getBasename(input)
    if (result !== expected)
      throw new Error(`special character handling failed for ${input}`)
  }
}
e.description = 'handles special characters'

const f = () => {
  try {
    getBasename('')
    throw new Error('empty input should throw')
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('empty input'))
      throw new Error('wrong error for empty input')
  }
}
f.description = 'handles invalid inputs'

const g = () => {
  const tests = [
    ['.', '.'],
    ['..', '..'],
    ['/', ''],
    ['./', '.'],
    ['./././', '.'],
    ['file.', 'file'],
    ['..file', '.'],
  ]

  for (const [input, expected] of tests) {
    const result = getBasename(input)
    if (result !== expected) {
      throw new Error(
        `edge case handling failed for "${input}", got "${result}", expected "${expected}"`,
      )
    }
  }
}
g.description = 'handles edge cases'

const h = () => {
  const tests = [
    ['文件.txt', '文件'],
    ['path/to/ファイル.doc', 'ファイル'],
    ['документ.pdf', 'документ'],
    ['path/to/παράδειγμα.txt', 'παράδειγμα'],
    ['路径/文件夹/文件.txt', '文件'],
  ]

  for (const [input, expected] of tests) {
    const result = getBasename(input)
    if (result !== expected)
      throw new Error(`Unicode handling failed for ${input}`)
  }
}
h.description = 'handles Unicode characters'

const i = () => {
  const tests = [
    ['C:\\path\\to\\file.txt', 'file'],
    ['D:\\Program Files\\app.exe', 'app'],
    ['\\\\server\\share\\doc.pdf', 'doc'],
    ['C:\\Users\\user\\doc.docx', 'doc'],
  ]

  for (const [input, expected] of tests) {
    const result = getBasename(input)
    if (result !== expected)
      throw new Error(`Windows path handling failed for ${input}`)
  }
}
i.description = 'handles Windows paths'

const j = () => {
  const tests = [
    ['http://example.com/file.txt', 'file'],
    ['https://site.com/path/doc.pdf', 'doc'],
    ['file:///root/file.txt', 'file'],
    ['//server/share/doc.pdf', 'doc'],
  ]

  for (const [input, expected] of tests) {
    const result = getBasename(input)
    if (result !== expected)
      throw new Error(`URL-like path handling failed for ${input}`)
  }
}
j.description = 'handles URL-like paths'

export { a, b, c, d, e, f, g, h, i, j }
