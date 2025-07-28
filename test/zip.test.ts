import path from 'path'

import fse from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import zip from '../src/zip.js'

const tempDir = path.join(process.cwd(), 'temp')
const tempFile = (name: string) => path.join(tempDir, name)
const tempSrcDir = tempFile('srcdir')
const tempSrcFile = tempFile('file.txt')

describe('zip - 真实文件系统测试', () => {
  beforeEach(async () => {
    await fse.ensureDir(tempDir)
    await fse.writeFile(tempSrcFile, 'hello zip')
    await fse.ensureDir(tempSrcDir)
    await fse.writeFile(path.join(tempSrcDir, 'a.txt'), 'A')
    await fse.writeFile(path.join(tempSrcDir, 'b.txt'), 'B')
  })

  afterEach(async () => {
    await fse.remove(tempDir)
  })

  it('应能压缩单个文件', async () => {
    await zip(tempSrcFile, tempDir, 'single.zip')
    const zipPath = tempFile('single.zip')
    expect(await fse.pathExists(zipPath)).toBe(true)
    // 检查文件大小大于0
    const stat = await fse.stat(zipPath)
    expect(stat.size).toBeGreaterThan(0)
  })

  it('应能压缩目录', async () => {
    await zip(tempSrcDir, tempDir, 'dir.zip')
    const zipPath = tempFile('dir.zip')
    expect(await fse.pathExists(zipPath)).toBe(true)
    const stat = await fse.stat(zipPath)
    expect(stat.size).toBeGreaterThan(0)
  })

  it('应能压缩多个文件', async () => {
    const files = [tempSrcFile, path.join(tempSrcDir, 'a.txt')]
    await zip(files, tempDir, 'multi.zip')
    const zipPath = tempFile('multi.zip')
    expect(await fse.pathExists(zipPath)).toBe(true)
    const stat = await fse.stat(zipPath)
    expect(stat.size).toBeGreaterThan(0)
  })

  it('应自动推断文件名和 base', async () => {
    await zip(tempSrcFile, tempDir)
    const zipPath = tempFile('temp.zip')
    expect(await fse.pathExists(zipPath)).toBe(true)
  })
})
