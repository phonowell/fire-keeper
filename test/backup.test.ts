import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import { join } from 'path'

import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import backup from '../src/backup.js'

// 临时文件统一路径
const tempDir = join(process.cwd(), 'temp')

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
    expect(existsSync(`${file3}.bak`)).toBe(false) // .md 文件不应该被备份
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

    // 不应该抛出错误
    await expect(backup(nonexistentFile)).resolves.toBeUndefined()

    // 不应该创建备份文件
    expect(existsSync(`${nonexistentFile}.bak`)).toBe(false)
  })

  it('处理空数组输入', async () => {
    // 不应该抛出错误
    await expect(backup([])).resolves.toBeUndefined()
  })

  it('处理空字符串输入', async () => {
    // 不应该抛出错误
    await expect(backup('')).resolves.toBeUndefined()
  })

  it('处理 undefined options', async () => {
    const testFile = join(tempDir, 'undefined-options.txt')
    const backupFile = `${testFile}.bak`

    writeFileSync(testFile, 'test content')

    await backup(testFile, undefined)

    expect(existsSync(backupFile)).toBe(true)
  })

  it('处理空 options 对象', async () => {
    const testFile = join(tempDir, 'empty-options.txt')
    const backupFile = `${testFile}.bak`

    writeFileSync(testFile, 'test content')

    await backup(testFile, {})

    expect(existsSync(backupFile)).toBe(true)
  })

  it('支持带扩展名的文件', async () => {
    const files = [
      join(tempDir, 'test.js'),
      join(tempDir, 'config.json'),
      join(tempDir, 'data.csv'),
      join(tempDir, 'README.md'),
    ]

    files.forEach((file) => writeFileSync(file, 'content'))

    await backup(files)

    files.forEach((file) => {
      expect(existsSync(`${file}.bak`)).toBe(true)
    })
  })

  it('处理特殊字符文件名', async () => {
    const specialFiles = [
      join(tempDir, '测试文件.txt'),
      join(tempDir, 'file with spaces.txt'),
      join(tempDir, 'file-with-dashes.txt'),
      join(tempDir, 'file_with_underscores.txt'),
    ]

    specialFiles.forEach((file) => writeFileSync(file, 'content'))

    await backup(specialFiles)

    specialFiles.forEach((file) => {
      expect(existsSync(`${file}.bak`)).toBe(true)
    })
  })

  it('备份文件内容正确', async () => {
    const testFile = join(tempDir, 'content-test.txt')
    const backupFile = `${testFile}.bak`
    const content = 'This is test content\nWith multiple lines\n中文内容'

    writeFileSync(testFile, content)

    await backup(testFile)

    expect(existsSync(backupFile)).toBe(true)

    // 验证备份文件内容与原文件相同
    const { readFileSync } = await import('fs')
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

    // 创建多个测试文件
    for (let i = 0; i < fileCount; i++) {
      const file = join(tempDir, `bulk-test-${i}.txt`)
      writeFileSync(file, `content ${i}`)
      files.push(file)
    }

    await backup(files, { concurrency: 3 })

    // 验证所有文件都被备份
    files.forEach((file) => {
      expect(existsSync(`${file}.bak`)).toBe(true)
    })
  })
})
