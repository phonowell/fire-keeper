import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import isExist from '../src/isExist.js'
import mkdir from '../src/mkdir.js'
import remove from '../src/remove.js'
import stat from '../src/stat.js'
import write from '../src/write.js'
import zip from '../src/zip.js'

const TEMP_DIR = './temp/zip'
const tempFile = (name: string) => `${TEMP_DIR}/${name}`
const tempSrcDir = tempFile('srcdir')
const tempSrcFile = tempFile('file.txt')

describe('zip - 真实文件系统测试', () => {
  beforeEach(async () => {
    await remove(TEMP_DIR)
    await mkdir(TEMP_DIR)
    await write(tempSrcFile, 'hello zip')
    await mkdir(tempSrcDir)
    await write(`${tempSrcDir}/a.txt`, 'A')
    await write(`${tempSrcDir}/b.txt`, 'B')
  })

  afterEach(async () => {
    await remove(TEMP_DIR)
  })

  it('应能压缩单个文件', async () => {
    await zip(tempSrcFile, TEMP_DIR, 'single.zip')
    const zipPath = tempFile('single.zip')
    expect(await isExist(zipPath)).toBe(true)
    // 检查文件大小大于0
    const info = await stat(zipPath)
    expect(info?.size).toBeGreaterThan(0)
  })

  it('应能压缩目录', async () => {
    await zip(tempSrcDir, TEMP_DIR, 'dir.zip')
    const zipPath = tempFile('dir.zip')
    expect(await isExist(zipPath)).toBe(true)
    const info = await stat(zipPath)
    expect(info?.size).toBeGreaterThan(0)
  })

  it('应能压缩多个文件', async () => {
    const files = [tempSrcFile, `${tempSrcDir}/a.txt`]
    await zip(files, TEMP_DIR, 'multi.zip')
    const zipPath = tempFile('multi.zip')
    expect(await isExist(zipPath)).toBe(true)
    const info = await stat(zipPath)
    expect(info?.size).toBeGreaterThan(0)
  })

  it('应自动推断文件名和 base', async () => {
    await zip(tempSrcFile, TEMP_DIR)
    const zipPath = tempFile('zip.zip')
    expect(await isExist(zipPath)).toBe(true)
  })
})
