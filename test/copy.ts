import { copy, isExist, isSame, os, sleep, write } from '../src/index.js'

import { TEMP } from './index.js'

const noMatch = async () => {
  await copy('nonexistent-*.txt')
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
  const source = `${TEMP}/original.txt`
  await write(source, 'content')
  await copy(source)

  const copiedFile = `${TEMP}/original.copy.txt`
  if (!(await isExist(copiedFile))) throw new Error('0')
  if (!(await isSame(source, copiedFile))) throw new Error('1')
}
e.description = 'default copy name in same directory'

const f = async () => {
  await write(`${TEMP}/f1.txt`, 'content1')
  await write(`${TEMP}/f2.txt`, 'content2')
  await write(`${TEMP}/other.txt`, 'other')

  const targetDir = `${TEMP}/target`

  await copy([`${TEMP}/f*.txt`, `${TEMP}/other.txt`], targetDir)

  if (!(await isExist(`${targetDir}/f1.txt`))) throw new Error('0')
  if (!(await isExist(`${targetDir}/f2.txt`))) throw new Error('1')
  if (!(await isExist(`${targetDir}/other.txt`))) throw new Error('2')
}
f.description = 'copy array of files with glob pattern'

const g = async () => {
  const source = `${TEMP}/g.txt`
  await write(source, 'content')

  await copy(source, (dirname) => `${dirname}/func`)
  if (!(await isExist(`${TEMP}/func/g.txt`))) throw new Error('0')
}
g.description = 'copy with function target'

const h = async () => {
  const source = `${TEMP}/h.txt`
  await write(source, 'content')

  await copy(source, TEMP, async (name) => {
    await sleep(10)
    return `async-${name}`
  })

  if (!(await isExist(`${TEMP}/async-h.txt`))) throw new Error('0')
}
h.description = 'copy with async function name'

const i = async () => {
  const source = `${TEMP}/i.txt`
  await write(source, 'content')

  await copy(source, TEMP, { filename: 'renamed.txt' })
  if (!(await isExist(`${TEMP}/renamed.txt`))) throw new Error('0')
}
i.description = 'copy with options.filename as string'

const j = async () => {
  const source = `${TEMP}/j.txt`
  await write(source, 'content')

  await copy(source, TEMP, {
    filename: (name) => `func-${name}`,
    concurrency: 1,
  })
  if (!(await isExist(`${TEMP}/func-j.txt`))) throw new Error('0')
}
j.description = 'copy with options.filename as function and non-concurrent'

const k = async () => {
  const source = `${TEMP}/k.txt`
  await write(source, 'content')

  await copy(source, async (dirname) => {
    await sleep(10)
    return `${dirname}/async-target`
  })
  if (!(await isExist(`${TEMP}/async-target/k.txt`))) throw new Error('0')
}
k.description = 'copy with async function target'

const l = async () => {
  const source = `${TEMP}/source.txt`
  await write(source, 'content')

  const targetDir = `${TEMP}/different`
  await copy(source, targetDir)

  if (!(await isExist(`${targetDir}/source.txt`))) throw new Error('0')
  if (await isExist(`${targetDir}/source.copy.txt`)) throw new Error('1')
}
l.description = 'default filename in different directory'

const m = async () => {
  const sources = Array.from({ length: 10 }, (_, i) => `${TEMP}/file${i}.txt`)
  await Promise.all(sources.map((s) => write(s, 'content')))

  await copy(sources, `${TEMP}/concurrent`)

  for (let i = 0; i < 10; i++) {
    if (!(await isExist(`${TEMP}/concurrent/file${i}.txt`)))
      throw new Error(`${i}`)
  }
}
m.description = 'default concurrent copy behavior'

export { noMatch, a, b, c, d, e, f, g, h, i, j, k, l, m }
