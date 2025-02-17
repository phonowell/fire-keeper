import path from 'path'

import { $, temp } from './index'

const a = async () => {
  const source = `${temp}/source/test.txt`
  const target = `${temp}/target`
  const content = 'a little message'

  await $.write(source, content)
  await $.move(source, target)

  // Verify target exists and source is gone
  if (!(await $.isExist(`${target}/test.txt`)))
    throw new Error('target file missing')
  if (await $.isExist(source)) throw new Error('source file still exists')

  // Verify content preserved
  const movedContent = await $.read<string>(`${target}/test.txt`)
  if (movedContent !== content) throw new Error('content mismatch')
}
a.description = 'moves single file'

const b = async () => {
  const source = `${temp}/source/test.txt`
  const target = `${temp}/target`

  await $.move(source, target)
  if (await $.isExist(`${target}/test.txt`))
    throw new Error('non-existent source should not create target')
}
b.description = 'handles non-existent source'

const c = async () => {
  // Test moving multiple files
  const sources = [
    `${temp}/source/test1.txt`,
    `${temp}/source/test2.txt`,
    `${temp}/source/test3.txt`,
  ]
  const target = `${temp}/target`
  const content = 'test content'

  // Create source files
  await Promise.all(sources.map(src => $.write(src, content)))
  await $.move(sources, target)

  // Verify all files moved
  for (const src of sources) {
    const fileName = path.basename(src)
    if (!(await $.isExist(`${target}/${fileName}`)))
      throw new Error(`target file ${fileName} missing`)
    if (await $.isExist(src))
      throw new Error(`source file ${fileName} still exists`)
  }
}
c.description = 'moves multiple files'

const d = async () => {
  // Test moving directory structure
  const sourceDir = `${temp}/source`
  const targetBase = `${temp}/target`

  // Clean up first to ensure fresh state
  await $.remove([sourceDir, targetBase])
  await $.mkdir(targetBase)

  // Create nested structure
  await $.mkdir(`${sourceDir}/nested/deep`)
  await $.write(`${sourceDir}/file1.txt`, 'test1')
  await $.write(`${sourceDir}/nested/file2.txt`, 'test2')
  await $.write(`${sourceDir}/nested/deep/file3.txt`, 'test3')

  // Create same directory structure in target
  await $.mkdir(`${targetBase}/nested/deep`)

  // Move files preserving structure
  await $.move(`${sourceDir}/*.txt`, targetBase)
  await $.move(`${sourceDir}/nested/*.txt`, `${targetBase}/nested`)
  await $.move(`${sourceDir}/nested/deep/*.txt`, `${targetBase}/nested/deep`)

  // Define test files with their expected locations
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

  // Verify all files moved correctly
  for (const file of files) {
    if (await $.isExist(file.src))
      throw new Error(`source file ${file.src} still exists`)
    if (!(await $.isExist(file.target)))
      throw new Error(`target file ${file.target} missing`)
  }
}
d.description = 'moves directory structure'

const e = async () => {
  // Test using target function
  const source = `${temp}/source/test.txt`
  const content = 'function target test'
  await $.write(source, content)

  await $.move(source, () => `${temp}/target`)

  const targetPath = `${temp}/target/test.txt`
  if (!(await $.isExist(targetPath))) throw new Error('target file missing')
  if (await $.isExist(source)) throw new Error('source file still exists')

  const movedContent = await $.read<string>(targetPath)
  if (movedContent !== content) throw new Error('content mismatch')
}
e.description = 'supports function target'

const f = async () => {
  // Test path normalization
  const source = `${temp}/./source/../source/test.txt`
  const target = `${temp}/./target/../target`
  const content = 'normalization test'

  await $.write(path.normalize(source), content)
  await $.move(source, target)

  const normalizedTarget = path.normalize(`${target}/test.txt`)
  if (!(await $.isExist(normalizedTarget)))
    throw new Error('normalized target missing')
  if (await $.isExist(path.normalize(source)))
    throw new Error('source still exists')
}
f.description = 'handles path normalization'

const g = async () => {
  // Test moving to existing directory with content
  const source = `${temp}/source/move.txt`
  const target = `${temp}/target`
  const existingFile = `${target}/existing.txt`

  await $.write(source, 'move content')
  await $.write(existingFile, 'existing content')
  await $.move(source, target)

  // Verify both files exist in target
  if (!(await $.isExist(`${target}/move.txt`)))
    throw new Error('moved file missing')
  if (!(await $.isExist(existingFile))) throw new Error('existing file missing')
  if (await $.isExist(source)) throw new Error('source file still exists')
}
g.description = 'moves to existing directory'

const h = async () => {
  // Test async target function
  const source = `${temp}/source/test.txt`
  const content = 'async function test'
  await $.write(source, content)

  await $.move(source, async () => {
    await $.sleep(100) // Simulate async operation
    return `${temp}/target`
  })

  const targetPath = `${temp}/target/test.txt`
  if (!(await $.isExist(targetPath))) throw new Error('target file missing')
  if (await $.isExist(source)) throw new Error('source file still exists')
}
h.description = 'supports async target function'

// Cleanup helper function
const cleanup = async () => {
  await $.remove([`${temp}/source`, `${temp}/target`])
}

export { a, b, c, d, e, f, g, h, cleanup }
