import { strict as assert } from 'assert'
import path from 'path'

import { backup, isExist, mkdir, read, remove, write } from '../src/index.js'

import { TEMP } from './index.js'

const testBasicBackup = async () => {
  const source = `${TEMP}/test.txt`
  const content = 'test content'
  await write(source, content)

  await backup(source)
  const backupFile = `${source}.bak`
  assert(await isExist(backupFile), 'backup file not created')
  let backupContent = await read(backupFile)
  assert(backupContent?.toString() === content, 'content mismatch')

  await write(source, 'updated content')
  await backup(source, { concurrency: 2 })
  backupContent = await read(backupFile)
  assert(
    backupContent?.toString() === 'updated content',
    'content not updated with concurrency',
  )
}
testBasicBackup.description = 'tests single file backup and concurrency options'

const testMultipleFiles = async () => {
  const dir = `${TEMP}/backup-test`
  const files = {
    'file1.txt': 'content1',
    'nested/file2.txt': 'content2',
    'nested/deep/file3.txt': 'content3',
  }

  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath)
    await mkdir(path.dirname(fullPath))
    await write(fullPath, content)
  }

  const filePaths = Object.entries(files).map(([f]) => path.join(dir, f))
  await backup(filePaths, { concurrency: 1 })

  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath)
    const backupFile = `${fullPath}.bak`
    assert(await isExist(backupFile), `backup not created for ${filePath}`)
    const backupContent = await read(backupFile)
    assert(
      backupContent?.toString() === content,
      `content mismatch for ${filePath}`,
    )
  }

  await remove(`${dir}/**/*.bak`)

  await backup(`${dir}/**/*`, { concurrency: 1 })
}
testMultipleFiles.description =
  'tests backing up multiple files and directories'

const testEdgeCases = async () => {
  await backup(`${TEMP}/non-existent-*.txt`)

  const testCases = [
    { name: 'special!@#.txt', content: 'test1' },
    { name: '文件.txt', content: 'test2' },
    { name: 'empty.txt', content: '' },
    { name: 'binary.bin', content: Buffer.from([1, 2, 3]) },
  ]

  for (const tc of testCases) {
    const source = `${TEMP}/${tc.name}`
    await write(source, tc.content)
    await backup(source)

    const backupFile = `${source}.bak`
    assert(await isExist(backupFile), `backup failed for ${tc.name}`)

    const backupContent = await read(backupFile, {
      raw: tc.content instanceof Buffer,
    })

    if (tc.content instanceof Buffer) {
      assert(
        Buffer.isBuffer(backupContent) && backupContent.equals(tc.content),
        `content mismatch for ${tc.name}`,
      )
    } else {
      assert(
        backupContent?.toString() === tc.content,
        `content mismatch for ${tc.name}`,
      )
    }
  }
}
testEdgeCases.description = 'tests edge cases and error handling'

export { testBasicBackup, testMultipleFiles, testEdgeCases }
