import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import isExist from '../src/isExist.js'
import link from '../src/link.js'
import mkdir from '../src/mkdir.js'
import remove from '../src/remove.js'
import write from '../src/write.js'

describe('isExist', () => {
  const tmpDir = './temp/isExist'
  const fileA = `${tmpDir}/a.txt`
  const fileB = `${tmpDir}/b.txt`
  const dirA = `${tmpDir}/dirA`
  const symlinkA = `${tmpDir}/symlinkA`
  const symlinkBroken = `${tmpDir}/symlinkBroken`
  const specialFile = `${tmpDir}/空格 文件.txt`
  const onlyDir = `${tmpDir}/onlyDir`
  const onlySymlink = `${tmpDir}/onlySymlink`
  const cycleSymlink = `${tmpDir}/cycleSymlink`

  beforeAll(async () => {
    await mkdir(tmpDir)
    await write(fileA, 'hello')
    await write(fileB, 'world')
    await mkdir(dirA)
    await link(fileA, symlinkA)
    await link(`${tmpDir}/notExist.txt`, symlinkBroken)
    await write(specialFile, 'special')
    await mkdir(onlyDir)
    await link(fileA, onlySymlink)
    await link(cycleSymlink, cycleSymlink)
  })

  afterAll(async () => {
    await remove(tmpDir)
  })

  it('所有存在类型：文件、目录、软链', async () => {
    expect(await isExist(fileA, fileB, dirA, symlinkA)).toBe(true)
    expect(await isExist(onlyDir)).toBe(true)
    expect(await isExist(onlySymlink)).toBe(true)
  })

  it('部分路径不存在', async () => {
    expect(await isExist(fileA, `${tmpDir}/notExist.txt`)).toBe(false)
    expect(await isExist([fileA, 'notExist.txt'])).toBe(false)
    expect(await isExist(symlinkBroken)).toBe(false)
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

  it('动态文件状态变化', async () => {
    await remove(dirA)
    expect(await isExist(dirA)).toBe(false)
    await mkdir(dirA)
    expect(await isExist(dirA)).toBe(true)
  })

  it('特殊路径场景', async () => {
    expect(await isExist(specialFile)).toBe(true)
    expect(await isExist(cycleSymlink)).toBe(false)
    // 绝对路径测试
    expect(await isExist(fileA)).toBe(true)
    // 相对路径测试
    expect(await isExist(`./${fileA}`)).toBe(true)
    expect(await isExist(fileA, fileA)).toBe(true)
    expect(await isExist(fileA, 'notExist.txt', fileA)).toBe(false)
    const readonlyFile = `${tmpDir}/readonly.txt`
    expect(await isExist(readonlyFile)).toBe(false)
  })
})
