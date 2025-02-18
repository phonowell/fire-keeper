import { copy, isExist, isSame, write, os, sleep } from '../src'

import { TEMP } from './index'

const noMatch = async () => {
  await copy('nonexistent-*.txt')
  // No error should be thrown for non-existent files
}
noMatch.description = 'no matching files'

const a = async () => {
  const source = './license.md'
  const target = `${TEMP}/test.md`

  await copy(source, TEMP, 'test.md')
  if (!(await isExist(target))) throw new Error('0')
  if (!(await isSame(source, target))) throw new Error('1')
}
a.description = 'copy with explicit target and name'

const b = async () => {
  const source = './license.md'
  const target = `${TEMP}/new/license.md`

  await copy(source, `${TEMP}/new`)
  if (!(await isExist(target))) throw new Error('0')
  if (!(await isSame(source, target))) throw new Error('1')
}
b.description = 'copy with target directory only'

const c = async () => {
  if (os() !== 'macos') return
  const source = './license.md'
  const target = '~/Downloads/temp/license.md'

  await copy(source, '~/Downloads/temp')
  if (!(await isExist(target))) throw new Error('0')
  if (!(await isSame(source, target))) throw new Error('1')
}
c.description = 'copy to home directory path'

const d = async () => {
  const source = `${TEMP}/a.txt`
  const target = `${TEMP}/b.txt`
  const content = 'a little message'
  await write(source, content)

  await copy(source, '', 'b.txt')
  if (!(await isSame(source, target))) throw new Error('0')
}
d.description = 'copy with empty target directory'

const e = async () => {
  // Test default copy name in same directory
  const source = `${TEMP}/original.txt`
  await write(source, 'content')
  await copy(source)

  const copiedFile = `${TEMP}/original.copy.txt`
  if (!(await isExist(copiedFile))) throw new Error('0')
  if (!(await isSame(source, copiedFile))) throw new Error('1')
}
e.description = 'default copy name in same directory'

const f = async () => {
  // Test array input and glob pattern
  await write(`${TEMP}/f1.txt`, 'content1')
  await write(`${TEMP}/f2.txt`, 'content2')
  await write(`${TEMP}/other.txt`, 'other')

  const targetDir = `${TEMP}/target`
  // Test both array and glob functionality
  await copy([`${TEMP}/f*.txt`, `${TEMP}/other.txt`], targetDir)

  if (!(await isExist(`${targetDir}/f1.txt`))) throw new Error('0')
  if (!(await isExist(`${targetDir}/f2.txt`))) throw new Error('1')
  if (!(await isExist(`${targetDir}/other.txt`))) throw new Error('2')
}
f.description = 'copy array of files with glob pattern'

const g = async () => {
  // Test function target
  const source = `${TEMP}/g.txt`
  await write(source, 'content')

  await copy(source, dirname => `${dirname}/func`)
  if (!(await isExist(`${TEMP}/func/g.txt`))) throw new Error('0')
}
g.description = 'copy with function target'

const h = async () => {
  // Test function name with async
  const source = `${TEMP}/h.txt`
  await write(source, 'content')

  await copy(source, TEMP, async name => {
    await sleep(10) // small delay
    return `async-${name}`
  })

  if (!(await isExist(`${TEMP}/async-h.txt`))) throw new Error('0')
}
h.description = 'copy with async function name'

const i = async () => {
  // Test options object - filename as string
  const source = `${TEMP}/i.txt`
  await write(source, 'content')

  await copy(source, TEMP, { filename: 'renamed.txt' })
  if (!(await isExist(`${TEMP}/renamed.txt`))) throw new Error('0')
}
i.description = 'copy with options.filename as string'

const j = async () => {
  // Test options object - filename as function
  const source = `${TEMP}/j.txt`
  await write(source, 'content')

  await copy(source, TEMP, {
    filename: name => `func-${name}`,
    concurrency: 1,
  })
  if (!(await isExist(`${TEMP}/func-j.txt`))) throw new Error('0')
}
j.description = 'copy with options.filename as function and non-concurrent'

const k = async () => {
  // Test async function target
  const source = `${TEMP}/k.txt`
  await write(source, 'content')

  await copy(source, async dirname => {
    await sleep(10)
    return `${dirname}/async-target`
  })
  if (!(await isExist(`${TEMP}/async-target/k.txt`))) throw new Error('0')
}
k.description = 'copy with async function target'

const l = async () => {
  // Test default filename behavior when copying to different directory
  const source = `${TEMP}/source.txt`
  await write(source, 'content')

  const targetDir = `${TEMP}/different`
  await copy(source, targetDir)

  // Should not add .copy suffix when target directory is different
  if (!(await isExist(`${targetDir}/source.txt`))) throw new Error('0')
  if (await isExist(`${targetDir}/source.copy.txt`)) throw new Error('1')
}
l.description = 'default filename in different directory'

const m = async () => {
  // Test concurrent copies with default concurrency (5)
  const sources = Array.from({ length: 10 }, (_, i) => `${TEMP}/file${i}.txt`)
  await Promise.all(sources.map(s => write(s, 'content')))

  // Test default concurrency (5)
  await copy(sources, `${TEMP}/concurrent`)

  // Only need to verify all files were copied successfully
  for (let i = 0; i < 10; i++) {
    if (!(await isExist(`${TEMP}/concurrent/file${i}.txt`)))
      throw new Error(`${i}`)
  }
}
m.description = 'default concurrent copy behavior'

export { noMatch, a, b, c, d, e, f, g, h, i, j, k, l, m }
