import path from 'path'

import fse from 'fs-extra'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import isSame from '../src/isSame.js'

describe('isSame', () => {
  const tmpDir = path.join(__dirname, 'temp', 'isSame')
  const fileA = path.join(tmpDir, 'a.txt')
  const fileB = path.join(tmpDir, 'b.txt')
  const fileC = path.join(tmpDir, 'c.txt')
  const fileEmpty = path.join(tmpDir, 'empty.txt')
  const fileNotExist = path.join(tmpDir, 'notExist.txt')
  const fileBin1 = path.join(tmpDir, 'bin1.bin')
  const fileBin2 = path.join(tmpDir, 'bin2.bin')
  const fileSpecial = path.join(tmpDir, '特殊字符.txt')

  beforeAll(async () => {
    await fse.ensureDir(tmpDir)
    await fse.writeFile(fileA, 'hello world')
    await fse.writeFile(fileB, 'hello world')
    await fse.writeFile(fileC, 'different content')
    await fse.writeFile(fileEmpty, '')
    await fse.writeFile(fileBin1, Buffer.from([1, 2, 3, 4, 5]))
    await fse.writeFile(fileBin2, Buffer.from([1, 2, 3, 4, 5]))
    await fse.writeFile(fileSpecial, 'hello world')
  })

  afterAll(async () => {
    await fse.remove(tmpDir)
  })

  it('文本内容一致返回 true，内容不同返回 false', async () => {
    expect(await isSame(fileA, fileB)).toBe(true)
    expect(await isSame(fileA, fileC)).toBe(false)
  })

  it('二进制文件内容一致返回 true', async () => {
    expect(await isSame(fileBin1, fileBin2)).toBe(true)
  })

  it('文件不存在、参数不足或空字符串路径返回 false', async () => {
    expect(await isSame(fileA, fileNotExist)).toBe(false)
    expect(await isSame(fileA)).toBe(false)
    expect(await isSame(fileNotExist, fileNotExist)).toBe(false)
    expect(await isSame('', fileA)).toBe(false)
  })

  it('文件大小不同或内容为空返回 false', async () => {
    expect(await isSame(fileA, fileEmpty)).toBe(false)
  })

  it('支持数组参数和多个文件比较', async () => {
    expect(await isSame([fileA, fileB], fileA)).toBe(true)
    expect(await isSame(fileA, fileB, fileA)).toBe(true)
    expect(await isSame(fileA, fileB, fileC)).toBe(false)
    expect(await isSame([fileA, fileB], [fileA, fileSpecial])).toBe(true)
    expect(await isSame([fileA, fileB], [fileC, fileSpecial])).toBe(false)
  })

  it('路径归一化和特殊字符文件名', async () => {
    const relA = path.relative(process.cwd(), fileA)
    const relB = path.relative(process.cwd(), fileB)
    expect(await isSame(relA, relB)).toBe(true)
    expect(await isSame(fileA, fileSpecial)).toBe(true)
  })
})
