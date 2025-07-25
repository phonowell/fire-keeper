import path from 'path'

import fse from 'fs-extra'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import isSame from '../src/isSame.js'

describe('isSame', () => {
  const tmpDir = path.join(process.cwd(), 'test-tmp-isSame')
  const fileA = path.join(tmpDir, 'a.txt')
  const fileB = path.join(tmpDir, 'b.txt')
  const fileC = path.join(tmpDir, 'c.txt')
  const fileEmpty = path.join(tmpDir, 'empty.txt')
  const fileNotExist = path.join(tmpDir, 'notExist.txt')
  const fileBin1 = path.join(tmpDir, 'bin1.bin')
  const fileBin2 = path.join(tmpDir, 'bin2.bin')
  const fileSpecial = path.join(tmpDir, '特殊字符.txt')
  const fileDup = path.join(tmpDir, 'dup.txt')

  beforeAll(async () => {
    await fse.ensureDir(tmpDir)
    await fse.writeFile(fileA, 'hello world')
    await fse.writeFile(fileB, 'hello world')
    await fse.writeFile(fileC, 'different content')
    await fse.writeFile(fileEmpty, '')
    await fse.writeFile(fileBin1, Buffer.from([1, 2, 3, 4, 5]))
    await fse.writeFile(fileBin2, Buffer.from([1, 2, 3, 4, 5]))
    await fse.writeFile(fileSpecial, 'hello world')
    await fse.writeFile(fileDup, 'dup')
  })

  afterAll(async () => {
    await fse.remove(tmpDir)
  })

  it('内容完全一致的文件应返回 true', async () => {
    expect(await isSame(fileA, fileB)).toBe(true)
  })

  it('内容不同的文件应返回 false', async () => {
    expect(await isSame(fileA, fileC)).toBe(false)
  })

  it('文件不存在应返回 false', async () => {
    expect(await isSame(fileA, fileNotExist)).toBe(false)
  })

  it('参数数量不足应返回 false', async () => {
    expect(await isSame(fileA)).toBe(false)
  })

  it('文件大小不同应返回 false', async () => {
    expect(await isSame(fileA, fileEmpty)).toBe(false)
  })

  it('内容为空应返回 false', async () => {
    expect(await isSame(fileEmpty, fileEmpty)).toBe(false)
  })

  it('支持数组参数混合', async () => {
    expect(await isSame([fileA, fileB], fileA)).toBe(true)
  })

  it('支持多个文件同时比较（全部一致）', async () => {
    expect(await isSame(fileA, fileB, fileA)).toBe(true)
  })

  it('支持多个文件同时比较（有不同则 false）', async () => {
    expect(await isSame(fileA, fileB, fileC)).toBe(false)
  })

  it('路径归一化后仍能正确比较', async () => {
    const relA = path.relative(process.cwd(), fileA)
    const relB = path.relative(process.cwd(), fileB)
    expect(await isSame(relA, relB)).toBe(true)
  })

  it('重复文件路径应返回 true', async () => {
    expect(await isSame(fileDup, fileDup)).toBe(true)
  })

  it('全部文件均不存在应返回 false', async () => {
    const temp1 = path.join(tmpDir, 'not-exist-1.txt')
    const temp2 = path.join(tmpDir, 'not-exist-2.txt')
    expect(await isSame(temp1, temp2)).toBe(false)
  })

  it('应处理边界情况和特殊场景', async () => {
    // 路径为空字符串
    expect(await isSame('', fileA)).toBe(false)

    // 二进制文件内容一致
    expect(await isSame(fileBin1, fileBin2)).toBe(true)

    // 特殊字符文件名内容一致
    expect(await isSame(fileA, fileSpecial)).toBe(true)

    // 混合数组与字符串参数（全部一致）
    expect(await isSame([fileA, fileB], [fileA, fileSpecial])).toBe(true)

    // 混合数组与字符串参数（有不同）
    expect(await isSame([fileA, fileB], [fileC, fileSpecial])).toBe(false)
  })
})
