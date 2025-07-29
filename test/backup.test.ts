import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import backup from '../src/backup.js'
import isExist from '../src/isExist.js'
import mkdir from '../src/mkdir.js'
import read from '../src/read.js'
import remove from '../src/remove.js'
import write from '../src/write.js'

const TEMP_DIR = './temp/backup'

describe('backup', () => {
  beforeEach(async () => {
    await remove(TEMP_DIR)
    await mkdir(TEMP_DIR)
  })

  afterAll(async () => {
    await remove(TEMP_DIR)
  })

  it('创建单个文件的备份', async () => {
    const testFile = `${TEMP_DIR}/test.txt`
    const backupFile = `${testFile}.bak`
    await write(testFile, 'test content')
    await backup(testFile)
    expect(await isExist(backupFile)).toBe(true)
  })

  it('支持自定义并发参数', async () => {
    const testFile = `${TEMP_DIR}/concurrent.txt`
    const backupFile = `${testFile}.bak`
    await write(testFile, 'concurrent test')
    await backup(testFile, { concurrency: 2 })
    expect(await isExist(backupFile)).toBe(true)
  })

  it('支持 glob 模式匹配', async () => {
    const file1 = `${TEMP_DIR}/test1.txt`
    const file2 = `${TEMP_DIR}/test2.txt`
    const file3 = `${TEMP_DIR}/other.md`
    await write(file1, 'content1')
    await write(file2, 'content2')
    await write(file3, 'markdown content')
    await backup(`${TEMP_DIR}/*.txt`)
    expect(await isExist(`${file1}.bak`)).toBe(true)
    expect(await isExist(`${file2}.bak`)).toBe(true)
    expect(await isExist(`${file3}.bak`)).toBe(false)
  })

  it('支持数组输入', async () => {
    const file1 = `${TEMP_DIR}/array1.txt`
    const file2 = `${TEMP_DIR}/array2.txt`
    await write(file1, 'content1')
    await write(file2, 'content2')
    await backup([file1, file2])
    expect(await isExist(`${file1}.bak`)).toBe(true)
    expect(await isExist(`${file2}.bak`)).toBe(true)
  })

  it('处理不存在的文件', async () => {
    const nonexistentFile = `${TEMP_DIR}/nonexistent.txt`
    await expect(backup(nonexistentFile)).resolves.toBeUndefined()
    expect(await isExist(`${nonexistentFile}.bak`)).toBe(false)
  })

  it('备份文件内容正确', async () => {
    const testFile = `${TEMP_DIR}/content-test.txt`
    const backupFile = `${testFile}.bak`
    const content = 'This is test content\nWith multiple lines\n中文内容'
    await write(testFile, content)
    await backup(testFile)
    expect(await isExist(backupFile)).toBe(true)
    const originalContent = ((await read(testFile)) ?? '').toString()
    const backupContent = ((await read(backupFile)) ?? '').toString()
    expect(backupContent).toBe(originalContent)
  })

  it('处理子目录中的文件', async () => {
    const subDir = `${TEMP_DIR}/subdir`
    await mkdir(subDir)
    const testFile = `${subDir}/nested.txt`
    const backupFile = `${testFile}.bak`
    await write(testFile, 'nested content')
    await backup(testFile)
    expect(await isExist(backupFile)).toBe(true)
  })

  it('处理大量文件', async () => {
    const fileCount = 10
    const files: string[] = []
    for (let i = 0; i < fileCount; i++) {
      const file = `${TEMP_DIR}/bulk-test-${i}.txt`
      await write(file, `content ${i}`)
      files.push(file)
    }
    await backup(files, { concurrency: 3 })
    for (const file of files) expect(await isExist(`${file}.bak`)).toBe(true)
  })
})
