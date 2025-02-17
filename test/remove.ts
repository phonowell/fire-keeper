import os from '../src/os'

import { $, temp } from './index'

const a = async () => {
  const source = `${temp}/re/move.txt`
  await $.write(source, 'test content')
  await $.remove(source)

  if (await $.isExist(source)) throw new Error('file not removed')
}
a.description = 'removes single file'

const b = async () => {
  const sources = [`${temp}/dir1`, `${temp}/dir2`, `${temp}/file.txt`]

  await $.mkdir([sources[0], sources[1]])
  await $.write(sources[2], 'test content')
  await $.remove(sources)

  for (const source of sources) {
    if (await $.isExist(source)) throw new Error(`path ${source} not removed`)
  }
}
b.description = 'removes multiple paths'

const c = async () => {
  // Test pattern-based removal
  const sources = [
    `${temp}/pattern/file1.txt`,
    `${temp}/pattern/nested/file2.txt`,
  ]

  for (const source of sources) {
    await $.write(source, 'test content')
  }

  await $.remove(`${temp}/**/*.txt`)

  // Files should be removed but directory should remain
  for (const source of sources) {
    if (await $.isExist(source)) throw new Error(`file ${source} not removed`)
  }
  if (!(await $.isExist(`${temp}/pattern/nested`)))
    throw new Error('directory incorrectly removed')
}
c.description = 'removes by pattern'

const d = async () => {
  // Test deep directory structure
  const deep = `${temp}/deep/nested/directory/structure`
  const files = [
    `${deep}/file1.txt`,
    `${deep}/file2.txt`,
    `${deep}/subdirectory/file3.txt`,
  ]

  await Promise.all(files.map(file => $.write(file, 'test')))
  await $.remove(deep)

  if (await $.isExist(deep))
    throw new Error('deep directory structure not removed')
}
d.description = 'removes deep structures'

const e = async () => {
  if (os() === 'windows') return // Skip on Windows

  // Test symlink removal
  const target = `${temp}/target.txt`
  const link = `${temp}/link.txt`

  await $.write(target, 'test content')
  await $.link(target, link)

  // Remove only the symlink
  await $.remove(link)
  if (await $.isExist(link)) throw new Error('symlink not removed')
  if (!(await $.isExist(target))) throw new Error('target incorrectly removed')

  // Remove the target
  await $.remove(target)
  if (await $.isExist(target)) throw new Error('target not removed')
}
e.description = 'removes symlinks'

const f = async () => {
  // Test special characters
  const sources = [
    `${temp}/special!@#$.txt`,
    `${temp}/unicode文件.txt`,
    `${temp}/space file.txt`,
  ]

  await Promise.all(sources.map(file => $.write(file, 'test')))
  await $.remove(sources)

  for (const source of sources) {
    if (await $.isExist(source))
      throw new Error(`special character file ${source} not removed`)
  }
}
f.description = 'handles special characters'

const g = async () => {
  // Test empty and non-existent paths
  const result1 = await $.remove('')
  if (result1) throw new Error('empty input should return false')

  const result2 = await $.remove([])
  if (result2) throw new Error('empty array should return false')

  const result3 = await $.remove([
    `${temp}/not-exist.txt`,
    `${temp}/not-exist-dir`,
  ])
  if (result3) throw new Error('non-existent paths should return false')

  // Invalid glob pattern should return false
  const result4 = await $.remove('[invalid-glob')
  if (result4) throw new Error('invalid glob pattern should return false')
}
g.description = 'handles invalid inputs'

const h = async () => {
  // Test mixed content
  const base = `${temp}/mixed`
  const structure = {
    file: `${base}/file.txt`,
    dir: `${base}/empty-dir`,
    nestedFile: `${base}/dir/nested.txt`,
    symlink: `${base}/link.txt`,
  }

  await $.mkdir(structure.dir)
  await $.write(structure.file, 'test')
  await $.write(structure.nestedFile, 'test')
  if (os() !== 'windows') {
    await $.link(structure.file, structure.symlink)
  }

  await $.remove(base)
  if (await $.isExist(base))
    throw new Error('mixed content directory not removed')
}
h.description = 'removes mixed content'

const i = async () => {
  // Test empty directory removal
  const emptyDir = `${temp}/empty`
  await $.mkdir(emptyDir)
  await $.remove(emptyDir)

  if (await $.isExist(emptyDir)) throw new Error('empty directory not removed')
}
i.description = 'removes empty directories'

const j = async () => {
  // Test successful removal returns true
  const testFile = `${temp}/success-test.txt`
  await $.write(testFile, 'test')

  const result = await $.remove(testFile)
  if (!result) throw new Error('successful removal should return true')
  if (await $.isExist(testFile)) throw new Error('file not actually removed')
}
j.description = 'returns correct boolean value'

// Cleanup helper (for any leftover test files)
const cleanup = async () => {
  await $.remove([
    `${temp}/re`,
    `${temp}/pattern`,
    `${temp}/deep`,
    `${temp}/target.txt`,
    `${temp}/link.txt`,
    `${temp}/mixed`,
    `${temp}/empty`,
    `${temp}/readonly.txt`,
    // Special character files should be gone, but just in case
    `${temp}/special!@#$.txt`,
    `${temp}/unicode文件.txt`,
    `${temp}/space file.txt`,
  ])
}

export { a, b, c, d, e, f, g, h, i, j, cleanup }
