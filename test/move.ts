import path from 'path'

import {
  isExist,
  mkdir,
  move,
  read,
  remove,
  sleep,
  write,
} from '../src/index.js'

import { TEMP } from './index.js'

const a = async () => {
  const source = `${TEMP}/source/test.txt`
  const target = `${TEMP}/target`
  const content = 'a little message'

  await write(source, content)
  await move(source, target)

  if (!(await isExist(`${target}/test.txt`)))
    throw new Error('target file missing')
  if (await isExist(source)) throw new Error('source file still exists')

  const movedContent = await read<string>(`${target}/test.txt`)
  if (movedContent !== content) throw new Error('content mismatch')
}
a.description = 'moves single file'

const b = async () => {
  const source = `${TEMP}/source/test.txt`
  const target = `${TEMP}/target`

  await move(source, target)
  if (await isExist(`${target}/test.txt`))
    throw new Error('non-existent source should not create target')
}
b.description = 'handles non-existent source'

const c = async () => {
  const sources = [
    `${TEMP}/source/test1.txt`,
    `${TEMP}/source/test2.txt`,
    `${TEMP}/source/test3.txt`,
  ]
  const target = `${TEMP}/target`
  const content = 'test content'

  await Promise.all(sources.map((src) => write(src, content)))
  await move(sources, target)

  for (const src of sources) {
    const fileName = path.basename(src)
    if (!(await isExist(`${target}/${fileName}`)))
      throw new Error(`target file ${fileName} missing`)
    if (await isExist(src))
      throw new Error(`source file ${fileName} still exists`)
  }
}
c.description = 'moves multiple files'

const d = async () => {
  const sourceDir = `${TEMP}/source`
  const targetBase = `${TEMP}/target`

  await remove([sourceDir, targetBase])
  await mkdir(targetBase)

  await mkdir(`${sourceDir}/nested/deep`)
  await write(`${sourceDir}/file1.txt`, 'test1')
  await write(`${sourceDir}/nested/file2.txt`, 'test2')
  await write(`${sourceDir}/nested/deep/file3.txt`, 'test3')

  await mkdir(`${targetBase}/nested/deep`)

  await move(`${sourceDir}/*.txt`, targetBase)
  await move(`${sourceDir}/nested/*.txt`, `${targetBase}/nested`)
  await move(`${sourceDir}/nested/deep/*.txt`, `${targetBase}/nested/deep`)

  const files = [
    { src: `${sourceDir}/file1.txt`, target: `${targetBase}/file1.txt` },
    {
      src: `${sourceDir}/nested/file2.txt`,
      target: `${targetBase}/nested/file2.txt`,
    },
    {
      src: `${sourceDir}/nested/deep/file3.txt`,
      target: `${targetBase}/nested/deep/file3.txt`,
    },
  ]

  for (const file of files) {
    if (await isExist(file.src))
      throw new Error(`source file ${file.src} still exists`)
    if (!(await isExist(file.target)))
      throw new Error(`target file ${file.target} missing`)
  }
}
d.description = 'moves directory structure'

const e = async () => {
  const source = `${TEMP}/source/test.txt`
  const content = 'function target test'
  await write(source, content)

  await move(source, () => `${TEMP}/target`)

  const targetPath = `${TEMP}/target/test.txt`
  if (!(await isExist(targetPath))) throw new Error('target file missing')
  if (await isExist(source)) throw new Error('source file still exists')

  const movedContent = await read<string>(targetPath)
  if (movedContent !== content) throw new Error('content mismatch')
}
e.description = 'supports function target'

const f = async () => {
  const source = `${TEMP}/./source/../source/test.txt`
  const target = `${TEMP}/./target/../target`
  const content = 'normalization test'

  await write(path.normalize(source), content)
  await move(source, target)

  const normalizedTarget = path.normalize(`${target}/test.txt`)
  if (!(await isExist(normalizedTarget)))
    throw new Error('normalized target missing')
  if (await isExist(path.normalize(source)))
    throw new Error('source still exists')
}
f.description = 'handles path normalization'

const g = async () => {
  const source = `${TEMP}/source/move.txt`
  const target = `${TEMP}/target`
  const existingFile = `${target}/existing.txt`

  await write(source, 'move content')
  await write(existingFile, 'existing content')
  await move(source, target)

  if (!(await isExist(`${target}/move.txt`)))
    throw new Error('moved file missing')
  if (!(await isExist(existingFile))) throw new Error('existing file missing')
  if (await isExist(source)) throw new Error('source file still exists')
}
g.description = 'moves to existing directory'

const h = async () => {
  const source = `${TEMP}/source/test.txt`
  const content = 'async function test'
  await write(source, content)

  await move(source, async () => {
    await sleep(100)
    return `${TEMP}/target`
  })

  const targetPath = `${TEMP}/target/test.txt`
  if (!(await isExist(targetPath))) throw new Error('target file missing')
  if (await isExist(source)) throw new Error('source file still exists')
}
h.description = 'supports async target function'

const cleanup = async () => {
  await remove([`${TEMP}/source`, `${TEMP}/target`])
}

export { a, b, c, d, e, f, g, h, cleanup }
