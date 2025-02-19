/**
 * 移动模块测试用例：
 *
 * a - 移动单个文件：验证基本的文件移动功能，确保源文件被成功移动到目标位置且内容保持一致
 * b - 处理不存在的源文件：验证当源文件不存在时的错误处理
 * c - 移动多个文件：验证同时移动多个文件的功能
 * d - 移动目录结构：验证在保持目录结构的情况下移动嵌套文件
 * e - 支持目标函数：验证使用函数动态生成目标路径的功能
 * f - 处理路径规范化：验证对包含 . 和 .. 的路径进行正确处理
 * g - 移动到已存在目录：验证移动文件到已包含其他文件的目录的功能
 * h - 支持异步目标函数：验证使用异步函数生成目标路径的功能
 */

import path from 'path'

import { isExist, move, read, remove, write, mkdir, sleep } from '../src'

import { TEMP } from './index'

const a = async () => {
  const source = `${TEMP}/source/test.txt`
  const target = `${TEMP}/target`
  const content = 'a little message'

  await write(source, content)
  await move(source, target)

  // Verify target exists and source is gone
  if (!(await isExist(`${target}/test.txt`)))
    throw new Error('target file missing')
  if (await isExist(source)) throw new Error('source file still exists')

  // Verify content preserved
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
  // Test moving multiple files
  const sources = [
    `${TEMP}/source/test1.txt`,
    `${TEMP}/source/test2.txt`,
    `${TEMP}/source/test3.txt`,
  ]
  const target = `${TEMP}/target`
  const content = 'test content'

  // Create source files
  await Promise.all(sources.map(src => write(src, content)))
  await move(sources, target)

  // Verify all files moved
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
  // Test moving directory structure
  const sourceDir = `${TEMP}/source`
  const targetBase = `${TEMP}/target`

  // Clean up first to ensure fresh state
  await remove([sourceDir, targetBase])
  await mkdir(targetBase)

  // Create nested structure
  await mkdir(`${sourceDir}/nested/deep`)
  await write(`${sourceDir}/file1.txt`, 'test1')
  await write(`${sourceDir}/nested/file2.txt`, 'test2')
  await write(`${sourceDir}/nested/deep/file3.txt`, 'test3')

  // Create same directory structure in target
  await mkdir(`${targetBase}/nested/deep`)

  // Move files preserving structure
  await move(`${sourceDir}/*.txt`, targetBase)
  await move(`${sourceDir}/nested/*.txt`, `${targetBase}/nested`)
  await move(`${sourceDir}/nested/deep/*.txt`, `${targetBase}/nested/deep`)

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
    if (await isExist(file.src))
      throw new Error(`source file ${file.src} still exists`)
    if (!(await isExist(file.target)))
      throw new Error(`target file ${file.target} missing`)
  }
}
d.description = 'moves directory structure'

const e = async () => {
  // Test using target function
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
  // Test path normalization
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
  // Test moving to existing directory with content
  const source = `${TEMP}/source/move.txt`
  const target = `${TEMP}/target`
  const existingFile = `${target}/existing.txt`

  await write(source, 'move content')
  await write(existingFile, 'existing content')
  await move(source, target)

  // Verify both files exist in target
  if (!(await isExist(`${target}/move.txt`)))
    throw new Error('moved file missing')
  if (!(await isExist(existingFile))) throw new Error('existing file missing')
  if (await isExist(source)) throw new Error('source file still exists')
}
g.description = 'moves to existing directory'

const h = async () => {
  // Test async target function
  const source = `${TEMP}/source/test.txt`
  const content = 'async function test'
  await write(source, content)

  await move(source, async () => {
    await sleep(100) // Simulate async operation
    return `${TEMP}/target`
  })

  const targetPath = `${TEMP}/target/test.txt`
  if (!(await isExist(targetPath))) throw new Error('target file missing')
  if (await isExist(source)) throw new Error('source file still exists')
}
h.description = 'supports async target function'

// Cleanup helper function
const cleanup = async () => {
  await remove([`${TEMP}/source`, `${TEMP}/target`])
}

export { a, b, c, d, e, f, g, h, cleanup }
