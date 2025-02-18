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

  // Test concurrent removal (default)
  await $.remove(sources)
  for (const source of sources) {
    if (await $.isExist(source)) throw new Error(`path ${source} not removed`)
  }

  // Recreate and test sequential removal
  await $.mkdir([sources[0], sources[1]])
  await $.write(sources[2], 'test content')
  await $.remove(sources, { isConcurrent: false })
  for (const source of sources) {
    if (await $.isExist(source))
      throw new Error(`path ${source} not removed (sequential)`)
  }
}
b.description = 'removes multiple paths (concurrent and sequential)'

const c = async () => {
  const sources = [
    `${temp}/pattern/file1.txt`,
    `${temp}/pattern/nested/file2.txt`,
  ]

  for (const source of sources) {
    await $.write(source, 'test content')
  }

  await $.remove(`${temp}/pattern/**/*.txt`)

  for (const source of sources) {
    if (await $.isExist(source)) throw new Error(`file ${source} not removed`)
  }
}
c.description = 'removes files using glob pattern'

const d = async () => {
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
d.description = 'removes deep directory structures'

const e = async () => {
  if (os() === 'windows') return // Skip on Windows

  const target = `${temp}/target.txt`
  const link = `${temp}/link.txt`

  await $.write(target, 'test content')
  await $.link(target, link)

  await $.remove(link)
  if (await $.isExist(link)) throw new Error('symlink not removed')
  if (!(await $.isExist(target))) throw new Error('target incorrectly removed')

  await $.remove(target)
  if (await $.isExist(target)) throw new Error('target not removed')
}
e.description = 'removes symlinks correctly'

const f = async () => {
  // Test non-matching glob pattern
  await $.remove(`${temp}/non-existing-pattern-*.txt`)

  // Test empty array
  await $.remove([])

  // Test non-existent paths
  await $.remove([`${temp}/not-exist.txt`, `${temp}/not-exist-dir`])
}
f.description = 'handles non-existent paths and patterns gracefully'

const g = async () => {
  const base = `${temp}/mixed`
  const structure = {
    file: `${base}/file.txt`,
    dir: `${base}/empty-dir`,
    nestedFile: `${base}/dir/nested.txt`,
  }

  await $.mkdir(structure.dir)
  await $.write(structure.file, 'test')
  await $.write(structure.nestedFile, 'test')

  await $.remove(base)
  if (await $.isExist(base))
    throw new Error('mixed content directory not removed')
}
g.description = 'removes mixed content (files and directories)'

// Cleanup helper
const cleanup = async () => {
  await $.remove([
    `${temp}/re`,
    `${temp}/pattern`,
    `${temp}/deep`,
    `${temp}/target.txt`,
    `${temp}/link.txt`,
    `${temp}/mixed`,
  ])
}

export { a, b, c, d, e, f, g, cleanup }
