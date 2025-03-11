import { isExist, link, mkdir, remove, write } from '../src'
import os from '../src/os'

import { TEMP } from './index'

const a = async () => {
  const source = `${TEMP}/a.txt`
  const content = 'aloha'
  await write(source, content)

  if (!(await isExist(source))) throw new Error('existing file not found')
}
a.description = 'checks single file existence'

const b = async () => {
  const source = `${TEMP}/not-exists.txt`
  if (await isExist(source))
    throw new Error('non-existent file reported as existing')
}
b.description = 'handles non-existent file'

const c = async () => {
  const sources = [`${TEMP}/a.txt`, `${TEMP}/b.txt`, `${TEMP}/c.txt`]
  const content = 'aloha'
  await Promise.all(sources.map((source) => write(source, content)))

  if (!(await isExist(sources)))
    throw new Error('multiple existing files not found')
}
c.description = 'checks multiple files'

const d = async () => {
  const sources = [`${TEMP}/a.txt`, `${TEMP}/b.txt`, `${TEMP}/c.txt`]
  const content = 'aloha'
  await Promise.all(sources.map((source) => write(source, content)))
  await remove(sources[0])

  if (await isExist(sources)) throw new Error('should fail if any file missing')
}
d.description = 'fails if any file missing'

const e = async () => {
  const source = `${TEMP}/dir`
  await mkdir(source)

  if (!(await isExist(source))) throw new Error('existing directory not found')
}
e.description = 'checks directory existence'

const f = async () => {
  const source = `${TEMP}/not-exists-dir`
  if (await isExist(source))
    throw new Error('non-existent directory reported as existing')
}
f.description = 'handles non-existent directory'

const g = async () => {
  const sources = [`${TEMP}/dir1`, `${TEMP}/dir2`, `${TEMP}/dir3`]
  await Promise.all(sources.map((source) => mkdir(source)))

  if (!(await isExist(sources)))
    throw new Error('multiple existing directories not found')
}
g.description = 'checks multiple directories'

const h = async () => {
  const sources = [`${TEMP}/dir1`, `${TEMP}/dir2`, `${TEMP}/dir3`]
  await Promise.all(sources.map((source) => mkdir(source)))
  await remove(sources[0])

  if (await isExist(sources))
    throw new Error('should fail if any directory missing')
}
h.description = 'fails if any directory missing'

const i = async () => {
  const sources = [`${TEMP}/dir`, `${TEMP}/subdir`, `${TEMP}/dir/file.txt`]
  await mkdir(sources[0])
  await mkdir(sources[1])
  await write(sources[2], 'content')

  if (!(await isExist(sources))) throw new Error('mixed paths not found')
}
i.description = 'checks mixed paths'

const j = async () => {
  const sources = [`${TEMP}/dir`, `${TEMP}/subdir`, `${TEMP}/dir/file.txt`]
  await write(sources[2], 'content')

  if (await isExist(sources)) throw new Error('should fail if any path missing')
}
j.description = 'fails if any mixed path missing'

const k = async () => {
  // Test with wildcard paths
  const source = `${TEMP}/*.txt`
  try {
    await isExist(source)
    throw new Error('should throw on wildcard paths')
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('invalid path'))
      throw new Error('wrong error for wildcard path')
  }
}
k.description = 'rejects wildcard paths'

const l = async () => {
  // Test path normalization
  const source = `${TEMP}/./normalize/../normalize/test.txt`
  const normalizedPath = `${TEMP}/normalize/test.txt`
  await write(normalizedPath, 'content')

  if (!(await isExist(source))) throw new Error('normalized path not found')
}
l.description = 'handles path normalization'

const m = async () => {
  // Test empty input
  if (await isExist()) throw new Error('empty input should return false')
  if (await isExist([])) throw new Error('empty array should return false')
  if (await isExist('')) throw new Error('empty string should return false')
}
m.description = 'handles empty input'

const mm = async () => {
  // Test null/undefined values in arrays
  if (await isExist(['valid.txt', null as unknown as string, 'also-valid.txt']))
    throw new Error('array with null should return false')
  if (
    await isExist([
      'valid.txt',
      undefined as unknown as string,
      'also-valid.txt',
    ])
  )
    throw new Error('array with undefined should return false')
  if (await isExist([`${TEMP}/exists.txt`, '', `${TEMP}/also-exists.txt`]))
    throw new Error('array with empty string should return false')

  // Create test files to ensure the logic isn't just always returning false
  await write(`${TEMP}/exists.txt`, 'content')
  await write(`${TEMP}/also-exists.txt`, 'content')
  if (!(await isExist([`${TEMP}/exists.txt`, `${TEMP}/also-exists.txt`])))
    throw new Error('valid paths should return true')
}
mm.description = 'handles null/undefined values in arrays'

const n = async () => {
  // Test symbolic links
  if (os() === 'windows') return // Skip on Windows

  const target = `${TEMP}/link-target.txt`
  const linkString = `${TEMP}/test-link`
  await write(target, 'content')
  await link(target, linkString)

  if (!(await isExist(linkString))) throw new Error('symlink not found')

  await remove(target)
  if (await isExist(linkString))
    throw new Error('broken symlink should return false')
}
n.description = 'handles symbolic links'

const o = async () => {
  // Test deeply nested paths
  const deep = `${TEMP}/a/b/c/d/e/f/g/h/i/j`
  await mkdir(deep)
  await write(`${deep}/test.txt`, 'content')

  if (!(await isExist(`${deep}/test.txt`)))
    throw new Error('deep path not found')
}
o.description = 'handles deep paths'

const p = async () => {
  // Test special characters in paths
  const paths = [
    `${TEMP}/special!@#txt`,
    `${TEMP}/unicode文件.txt`,
    `${TEMP}/space file.txt`,
  ]

  await Promise.all(paths.map((path) => write(path, 'content')))

  for (const path of paths) {
    if (!(await isExist(path)))
      throw new Error(`special character path not found: ${path}`)
  }
}
p.description = 'handles special characters'

export { a, b, c, d, e, f, g, h, i, j, k, l, m, mm, n, o, p }
