import path from 'path'

import fse from 'fs-extra'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import isExist from '../src/isExist.js'

describe('isExist', () => {
  const tmpDir = path.join(process.cwd(), 'temp', 'isExist')
  const fileA = path.join(tmpDir, 'a.txt')
  const fileB = path.join(tmpDir, 'b.txt')
  const dirA = path.join(tmpDir, 'dirA')
  const symlinkA = path.join(tmpDir, 'symlinkA')
  const symlinkBroken = path.join(tmpDir, 'symlinkBroken')
  const specialFile = path.join(tmpDir, '空格 文件.txt')
  const onlyDir = path.join(tmpDir, 'onlyDir')
  const onlySymlink = path.join(tmpDir, 'onlySymlink')
  const cycleSymlink = path.join(tmpDir, 'cycleSymlink')

  beforeAll(async () => {
    await fse.ensureDir(tmpDir)
    await fse.writeFile(fileA, 'hello')
    await fse.writeFile(fileB, 'world')
    await fse.ensureDir(dirA)
    await fse.symlink(fileA, symlinkA)
    await fse.symlink(path.join(tmpDir, 'notExist.txt'), symlinkBroken)
    await fse.writeFile(specialFile, 'special')
    await fse.ensureDir(onlyDir)
    await fse.symlink(fileA, onlySymlink)
    await fse.symlink(cycleSymlink, cycleSymlink)
  })

  afterAll(async () => {
    await fse.remove(tmpDir)
  })

  it('所有存在类型：文件、目录、软链', async () => {
    expect(await isExist(fileA, fileB, dirA, symlinkA)).toBe(true)
    expect(await isExist(onlyDir)).toBe(true)
    expect(await isExist(onlySymlink)).toBe(true)
  })

  it('部分路径不存在', async () => {
    expect(await isExist(fileA, path.join(tmpDir, 'notExist.txt'))).toBe(false)
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
    await fse.remove(dirA)
    expect(await isExist(dirA)).toBe(false)
    await fse.ensureDir(dirA)
    expect(await isExist(dirA)).toBe(true)
  })

  it('特殊路径场景', async () => {
    expect(await isExist(specialFile)).toBe(true)
    expect(await isExist(cycleSymlink)).toBe(false)
    expect(await isExist(path.resolve(fileA))).toBe(true)
    const relPath = path.relative(process.cwd(), fileA)
    expect(await isExist(relPath)).toBe(true)
    expect(await isExist(fileA, fileA)).toBe(true)
    expect(await isExist(fileA, 'notExist.txt', fileA)).toBe(false)
    const readonlyFile = path.join(tmpDir, 'readonly.txt')
    expect(await isExist(readonlyFile)).toBe(false)
  })
})
