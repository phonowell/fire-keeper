import os from '../src/os'

import { $, temp } from './index'

const a = async () => {
  const source = `${temp}/a.txt`
  const content = 'aloha'
  await $.write(source, content)

  if (!(await $.isExist(source))) throw new Error('existing file not found')
}
a.description = 'checks single file existence'

const b = async () => {
  const source = `${temp}/not-exists.txt`
  if (await $.isExist(source))
    throw new Error('non-existent file reported as existing')
}
b.description = 'handles non-existent file'

const c = async () => {
  const sources = [`${temp}/a.txt`, `${temp}/b.txt`, `${temp}/c.txt`]
  const content = 'aloha'
  await Promise.all(sources.map(source => $.write(source, content)))

  if (!(await $.isExist(sources)))
    throw new Error('multiple existing files not found')
}
c.description = 'checks multiple files'

const d = async () => {
  const sources = [`${temp}/a.txt`, `${temp}/b.txt`, `${temp}/c.txt`]
  const content = 'aloha'
  await Promise.all(sources.map(source => $.write(source, content)))
  await $.remove(sources[0])

  if (await $.isExist(sources))
    throw new Error('should fail if any file missing')
}
d.description = 'fails if any file missing'

const e = async () => {
  const source = `${temp}/dir`
  await $.mkdir(source)

  if (!(await $.isExist(source)))
    throw new Error('existing directory not found')
}
e.description = 'checks directory existence'

const f = async () => {
  const source = `${temp}/not-exists-dir`
  if (await $.isExist(source))
    throw new Error('non-existent directory reported as existing')
}
f.description = 'handles non-existent directory'

const g = async () => {
  const sources = [`${temp}/dir1`, `${temp}/dir2`, `${temp}/dir3`]
  await Promise.all(sources.map(source => $.mkdir(source)))

  if (!(await $.isExist(sources)))
    throw new Error('multiple existing directories not found')
}
g.description = 'checks multiple directories'

const h = async () => {
  const sources = [`${temp}/dir1`, `${temp}/dir2`, `${temp}/dir3`]
  await Promise.all(sources.map(source => $.mkdir(source)))
  await $.remove(sources[0])

  if (await $.isExist(sources))
    throw new Error('should fail if any directory missing')
}
h.description = 'fails if any directory missing'

const i = async () => {
  const sources = [`${temp}/dir`, `${temp}/subdir`, `${temp}/dir/file.txt`]
  await $.mkdir(sources[0])
  await $.mkdir(sources[1])
  await $.write(sources[2], 'content')

  if (!(await $.isExist(sources))) throw new Error('mixed paths not found')
}
i.description = 'checks mixed paths'

const j = async () => {
  const sources = [`${temp}/dir`, `${temp}/subdir`, `${temp}/dir/file.txt`]
  await $.write(sources[2], 'content')

  if (await $.isExist(sources))
    throw new Error('should fail if any path missing')
}
j.description = 'fails if any mixed path missing'

const k = async () => {
  // Test with wildcard paths
  const source = `${temp}/*.txt`
  try {
    await $.isExist(source)
    throw new Error('should throw on wildcard paths')
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('invalid path'))
      throw new Error('wrong error for wildcard path')
  }
}
k.description = 'rejects wildcard paths'

const l = async () => {
  // Test path normalization
  const source = `${temp}/./normalize/../normalize/test.txt`
  const normalizedPath = `${temp}/normalize/test.txt`
  await $.write(normalizedPath, 'content')

  if (!(await $.isExist(source))) throw new Error('normalized path not found')
}
l.description = 'handles path normalization'

const m = async () => {
  // Test empty input
  if (await $.isExist()) throw new Error('empty input should return false')
  if (await $.isExist([])) throw new Error('empty array should return false')
  if (await $.isExist('')) throw new Error('empty string should return false')
}
m.description = 'handles empty input'

const n = async () => {
  // Test symbolic links
  if (os() === 'windows') return // Skip on Windows

  const target = `${temp}/link-target.txt`
  const link = `${temp}/test-link`
  await $.write(target, 'content')
  await $.link(target, link)

  if (!(await $.isExist(link))) throw new Error('symlink not found')

  await $.remove(target)
  if (await $.isExist(link))
    throw new Error('broken symlink should return false')
}
n.description = 'handles symbolic links'

const o = async () => {
  // Test deeply nested paths
  const deep = `${temp}/a/b/c/d/e/f/g/h/i/j`
  await $.mkdir(deep)
  await $.write(`${deep}/test.txt`, 'content')

  if (!(await $.isExist(`${deep}/test.txt`)))
    throw new Error('deep path not found')
}
o.description = 'handles deep paths'

const p = async () => {
  // Test special characters in paths
  const paths = [
    `${temp}/special!@#$.txt`,
    `${temp}/unicode文件.txt`,
    `${temp}/space file.txt`,
  ]

  await Promise.all(paths.map(path => $.write(path, 'content')))

  for (const path of paths) {
    if (!(await $.isExist(path)))
      throw new Error(`special character path not found: ${path}`)
  }
}
p.description = 'handles special characters'

// Cleanup helper
const cleanup = async () => {
  await $.remove([
    `${temp}/a.txt`,
    `${temp}/b.txt`,
    `${temp}/c.txt`,
    `${temp}/dir`,
    `${temp}/dir1`,
    `${temp}/dir2`,
    `${temp}/dir3`,
    `${temp}/normalize`,
    `${temp}/link-target.txt`,
    `${temp}/test-link`,
    `${temp}/a`, // Deep path parent
    `${temp}/special!@#$.txt`,
    `${temp}/unicode文件.txt`,
    `${temp}/space file.txt`,
  ])
}

export { a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, cleanup }
