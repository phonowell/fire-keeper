import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { join } from 'path'

import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import backup from '../src/backup.js'

const tempDir = 'temp'

const cleanTemp = () => {
  if (existsSync(tempDir)) rmSync(tempDir, { recursive: true, force: true })
}

describe('backup', () => {
  beforeEach(() => {
    cleanTemp()
    mkdirSync(tempDir, { recursive: true })
  })

  afterAll(() => {
    cleanTemp()
  })

  it('创建单个文件的备份', async () => {
    const testFile = join(tempDir, 'test.txt')
    const backupFile = `${testFile}.bak`
    writeFileSync(testFile, 'test content')
    await backup(testFile)
    expect(existsSync(backupFile)).toBe(true)
  })

  it('支持自定义并发参数', async () => {
    const testFile = join(tempDir, 'concurrent.txt')
    const backupFile = `${testFile}.bak`
    writeFileSync(testFile, 'concurrent test')
    await backup(testFile, { concurrency: 2 })
    expect(existsSync(backupFile)).toBe(true)
  })

  it('支持 glob 模式匹配', async () => {
    const file1 = join(tempDir, 'test1.txt')
    const file2 = join(tempDir, 'test2.txt')
    const file3 = join(tempDir, 'other.md')
    writeFileSync(file1, 'content1')
    writeFileSync(file2, 'content2')
    writeFileSync(file3, 'markdown content')
    await backup(join(tempDir, '*.txt'))
    expect(existsSync(`${file1}.bak`)).toBe(true)
    expect(existsSync(`${file2}.bak`)).toBe(true)
    expect(existsSync(`${file3}.bak`)).toBe(false)
  })

  it('支持数组输入', async () => {
    const file1 = join(tempDir, 'array1.txt')
    const file2 = join(tempDir, 'array2.txt')
    writeFileSync(file1, 'content1')
    writeFileSync(file2, 'content2')
    await backup([file1, file2])
    expect(existsSync(`${file1}.bak`)).toBe(true)
    expect(existsSync(`${file2}.bak`)).toBe(true)
  })

  it('处理不存在的文件', async () => {
    const nonexistentFile = join(tempDir, 'nonexistent.txt')
    await expect(backup(nonexistentFile)).resolves.toBeUndefined()
    expect(existsSync(`${nonexistentFile}.bak`)).toBe(false)
  })

  it('备份文件内容正确', async () => {
    const testFile = join(tempDir, 'content-test.txt')
    const backupFile = `${testFile}.bak`
    const content = 'This is test content\nWith multiple lines\n中文内容'
    writeFileSync(testFile, content)
    await backup(testFile)
    expect(existsSync(backupFile)).toBe(true)
    const originalContent = readFileSync(testFile, 'utf8')
    const backupContent = readFileSync(backupFile, 'utf8')
    expect(backupContent).toBe(originalContent)
  })

  it('处理子目录中的文件', async () => {
    const subDir = join(tempDir, 'subdir')
    mkdirSync(subDir, { recursive: true })
    const testFile = join(subDir, 'nested.txt')
    const backupFile = `${testFile}.bak`
    writeFileSync(testFile, 'nested content')
    await backup(testFile)
    expect(existsSync(backupFile)).toBe(true)
  })

  it('处理大量文件', async () => {
    const fileCount = 10
    const files: string[] = []
    for (let i = 0; i < fileCount; i++) {
      const file = join(tempDir, `bulk-test-${i}.txt`)
      writeFileSync(file, `content ${i}`)
      files.push(file)
    }
    await backup(files, { concurrency: 3 })
    files.forEach((file) => {
      expect(existsSync(`${file}.bak`)).toBe(true)
    })
  })
})
