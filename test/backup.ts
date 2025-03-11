import { strict as assert } from 'assert'
import path from 'path'

import { backup, isExist, mkdir, read, remove, write } from '../src'

import { TEMP } from './index'

// Test single file backup and concurrency
const testBasicBackup = async () => {
  const source = `${TEMP}/test.txt`
  const content = 'test content'
  await write(source, content)

  // Test with default concurrency
  await backup(source)
  const backupFile = `${source}.bak`
  assert(await isExist(backupFile), 'backup file not created')
  let backupContent = await read(backupFile)
  assert(backupContent?.toString() === content, 'content mismatch')

  // Test with custom concurrency
  await write(source, 'updated content')
  await backup(source, { concurrency: 2 })
  backupContent = await read(backupFile)
  assert(
    backupContent?.toString() === 'updated content',
    'content not updated with concurrency',
  )
}
testBasicBackup.description = 'tests single file backup and concurrency options'

// Test multiple files and directory structure
const testMultipleFiles = async () => {
  const dir = `${TEMP}/backup-test`
  const files = {
    'file1.txt': 'content1',
    'nested/file2.txt': 'content2',
    'nested/deep/file3.txt': 'content3',
  }

  // Create test files
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath)
    await mkdir(path.dirname(fullPath))
    await write(fullPath, content)
  }

  // Test array of files and glob pattern
  const filePaths = Object.entries(files).map(([f]) => path.join(dir, f))
  await backup(filePaths, { concurrency: 1 }) // Use sequential execution to avoid race conditions

  // Verify backups
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

  // Clean previous backups
  await remove(`${dir}/**/*.bak`)

  // Test glob pattern with sequential execution
  await backup(`${dir}/**/*`, { concurrency: 1 })
}
testMultipleFiles.description =
  'tests backing up multiple files and directories'

// Test edge cases and error handling
const testEdgeCases = async () => {
  // Test empty glob pattern
  await backup(`${TEMP}/non-existent-*.txt`)

  // Test special characters and file types
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
