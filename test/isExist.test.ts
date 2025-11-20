import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import isExist from '../src/isExist.js'
import mkdir from '../src/mkdir.js'
import remove from '../src/remove.js'
import write from '../src/write.js'

describe('isExist', () => {
  const tmpDir = './temp/isExist'
  const fileA = `${tmpDir}/a.txt`
  const fileB = `${tmpDir}/b.txt`
  const dirA = `${tmpDir}/dirA`
  const specialFile = `${tmpDir}/空格 文件.txt`
  const onlyDir = `${tmpDir}/onlyDir`

  beforeAll(async () => {
    await mkdir(tmpDir)
    await write(fileA, 'hello')
    await write(fileB, 'world')
    await mkdir(dirA)
    await write(specialFile, 'special')
    await mkdir(onlyDir)
  })

  afterAll(async () => {
    await remove(tmpDir)
  })

  it('所有存在类型：文件、目录', async () => {
    expect(await isExist(fileA)).toBe(true)
    expect(await isExist(fileB)).toBe(true)
    expect(await isExist(dirA)).toBe(true)
    expect(await isExist(onlyDir)).toBe(true)
    expect(await isExist(fileA, fileB, dirA)).toBe(true)
  })

  it('部分路径不存在', async () => {
    expect(await isExist(fileA, `${tmpDir}/notExist.txt`)).toBe(false)
    expect(await isExist([fileA, 'notExist.txt'])).toBe(false)
    expect(await isExist(['', fileA])).toBe(false)
    expect(await isExist('')).toBe(false)
    expect(await isExist()).toBe(false)
  })

  it('路径包含 glob 模式应抛异常', async () => {
    await expect(isExist(fileA, '*.txt')).rejects.toThrow(/invalid path/)
  })

  it('支持数组参数混合', async () => {
    expect(await isExist([fileA, fileB], dirA)).toBe(true)
  })

  it('特殊路径场景', async () => {
    expect(await isExist(specialFile)).toBe(true)

    // 绝对路径测试
    expect(await isExist(fileA)).toBe(true)
    // 相对路径测试
    expect(await isExist(`./${fileA}`)).toBe(true)
    expect(await isExist(fileA, fileA)).toBe(true)
    expect(await isExist(fileA, 'notExist.txt', fileA)).toBe(false)
  })
})
