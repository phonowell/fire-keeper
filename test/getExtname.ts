import { getExtname } from '../src/index.js'

const a = () => {
  if (typeof getExtname !== 'function')
    throw new Error('getExtname function not found')
}
a.description = 'function exists'

const b = () => {
  // Test basic extension extraction
  const tests = [
    ['file.txt', '.txt'],
    ['document.pdf', '.pdf'],
    ['script.js', '.js'],
    ['style.css', '.css'],
    ['data.json', '.json'],
  ]

  for (const [input, expected] of tests) {
    const result = getExtname(input)
    if (result !== expected) {
      throw new Error(
        `extension extraction failed for ${input}, got ${result}, expected ${expected}`,
      )
    }
  }
}
b.description = 'extracts basic extensions'

const c = () => {
  // Test files with no extension
  const tests = [
    ['README', ''],
    ['makefile', ''],
    ['dockerfile', ''],
    ['/path/to/file', ''],
    ['.hidden', ''],
  ]

  for (const [input, expected] of tests) {
    const result = getExtname(input)
    if (result !== expected)
      throw new Error(`no extension handling failed for ${input}`)
  }
}
c.description = 'handles no extensions'

const d = () => {
  // Test multiple extensions
  const tests = [
    ['archive.tar.gz', '.gz'],
    ['script.test.js', '.js'],
    ['styles.min.css', '.css'],
    ['file.spec.ts', '.ts'],
    ['data.backup.json', '.json'],
  ]

  for (const [input, expected] of tests) {
    const result = getExtname(input)
    if (result !== expected)
      throw new Error(`multiple extension handling failed for ${input}`)
  }
}
d.description = 'handles multiple extensions'

const e = () => {
  // Test hidden files and special cases
  const tests = [
    ['.gitignore', ''],
    ['.env', ''],
    ['.env.local', '.local'],
    ['.bashrc', ''],
    ['.config.json', '.json'],
  ]

  for (const [input, expected] of tests) {
    const result = getExtname(input)
    if (result !== expected)
      throw new Error(`hidden file handling failed for ${input}`)
  }
}
e.description = 'handles hidden files'

const f = () => {
  // Test empty and invalid inputs
  try {
    getExtname('')
    throw new Error('empty input should throw')
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('empty input'))
      throw new Error('wrong error for empty input')
  }

  // Whitespace is treated as a valid path by path.extname
  const result = getExtname('   ')
  if (result !== '') throw new Error('whitespace should return empty extension')
}
f.description = 'handles invalid inputs'

const g = () => {
  // Test case sensitivity
  const tests = [
    ['file.TXT', '.TXT'],
    ['script.JS', '.JS'],
    ['style.Css', '.Css'],
    ['DATA.JSON', '.JSON'],
    ['test.Ts', '.Ts'],
  ]

  for (const [input, expected] of tests) {
    const result = getExtname(input)
    if (result !== expected)
      throw new Error(`case sensitivity failed for ${input}`)
  }
}
g.description = 'preserves case sensitivity'

const h = () => {
  // Test special extensions and formats
  const tests = [
    ['file.d.ts', '.ts'],
    ['file.test.d.ts', '.ts'],
    ['file.spec.jsx', '.jsx'],
    ['file.min.map', '.map'],
    ['file.bundle.js.map', '.map'],
  ]

  for (const [input, expected] of tests) {
    const result = getExtname(input)
    if (result !== expected)
      throw new Error(`special extension handling failed for ${input}`)
  }
}
h.description = 'handles special formats'

const i = () => {
  // Test paths with dots
  const tests = [
    ['path.to.file.txt', '.txt'],
    ['.file.with.dots.md', '.md'],
    ['..hidden.file.yml', '.yml'],
    ['file....dots.conf', '.conf'],
    ['path/to/v1.2.3.txt', '.txt'],
  ]

  for (const [input, expected] of tests) {
    const result = getExtname(input)
    if (result !== expected) throw new Error(`dot handling failed for ${input}`)
  }
}
i.description = 'handles paths with dots'

const j = () => {
  // Test edge cases
  const tests = [
    ['.', ''],
    ['..', ''],
    ['file.', '.'],
    ['.file.', '.'],
    ['...', '.'], // Node's path.extname considers last dot as extension
  ]

  for (const [input, expected] of tests) {
    const result = getExtname(input)
    if (result !== expected) {
      throw new Error(
        `edge case handling failed for "${input}", got "${result}", expected "${expected}"`,
      )
    }
  }
}
j.description = 'handles edge cases'

export { a, b, c, d, e, f, g, h, i, j }
