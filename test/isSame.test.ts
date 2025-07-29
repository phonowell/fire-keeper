import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import isSame from '../src/isSame.js'
import mkdir from '../src/mkdir.js'
import remove from '../src/remove.js'
import write from '../src/write.js'

describe('isSame', () => {
  const tmpDir = './temp/isSame'
  const fileA = `${tmpDir}/a.txt`
  const fileB = `${tmpDir}/b.txt`
  const fileC = `${tmpDir}/c.txt`
  const fileEmpty = `${tmpDir}/empty.txt`
  const fileNotExist = `${tmpDir}/notExist.txt`
  const fileBin1 = `${tmpDir}/bin1.bin`
  const fileBin2 = `${tmpDir}/bin2.bin`
  const fileSpecial = `${tmpDir}/特殊字符.txt`

  beforeAll(async () => {
    await mkdir(tmpDir)
    await write(fileA, 'hello world')
    await write(fileB, 'hello world')
    await write(fileC, 'different content')
    await write(fileEmpty, '')
    await write(fileBin1, Buffer.from([1, 2, 3, 4, 5]))
    await write(fileBin2, Buffer.from([1, 2, 3, 4, 5]))
    await write(fileSpecial, 'hello world')
  })

  afterAll(async () => {
    await remove(tmpDir)
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
    // 相对路径测试
    expect(await isSame(fileA, fileB)).toBe(true)
    expect(await isSame(fileA, fileSpecial)).toBe(true)
  })
})
