// 单元测试：仅针对 clean.ts 功能，使用真实文件系统，所有临时文件均在 temp 目录，测试后自动清理
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import clean from '../src/clean.js'

const tempDir = join(process.cwd(), 'temp', 'clean')

const safeRm = (path: string) => {
  try {
    if (existsSync(path)) rmSync(path, { recursive: true, force: true })
  } catch {}
}

const createFile = (filePath: string, content = '') => {
  const dir = dirname(filePath)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(filePath, content)
}

describe('clean', () => {
  beforeEach(() => {
    safeRm(tempDir)
    mkdirSync(tempDir, { recursive: true })
  })

  afterEach(() => {
    safeRm(tempDir)
  })

  it('应删除单个文件及空父目录', async () => {
    const file = join(tempDir, 'a.txt')
    createFile(file, 'test')
    await clean(file)
    expect(existsSync(file)).toBe(false)
    expect(existsSync(tempDir)).toBe(false)
  })

  it('父目录不空时不删除目录', async () => {
    const file1 = join(tempDir, 'a.txt')
    const file2 = join(tempDir, 'b.txt')
    createFile(file1, '1')
    createFile(file2, '2')
    await clean(file1)
    expect(existsSync(file1)).toBe(false)
    expect(existsSync(file2)).toBe(true)
    expect(existsSync(tempDir)).toBe(true)
  })

  it('支持数组参数，全部删除且父目录为空则删除目录', async () => {
    const file1 = join(tempDir, 'a.txt')
    const file2 = join(tempDir, 'b.txt')
    createFile(file1, '1')
    createFile(file2, '2')
    await clean([file1, file2])
    expect(existsSync(file1)).toBe(false)
    expect(existsSync(file2)).toBe(false)
    expect(existsSync(tempDir)).toBe(false)
  })

  it('无匹配文件时应无异常且目录不变', async () => {
    await clean(join(tempDir, 'notfound.txt'))
    expect(existsSync(tempDir)).toBe(true)
  })

  it('异常时应抛出错误', async () => {
    // 传入非法路径，glob会报错
    await expect(clean('\0')).rejects.toThrow()
  })
})
