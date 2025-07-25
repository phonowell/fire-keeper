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
    // 循环软链
    await fse.symlink(cycleSymlink, cycleSymlink)
  })

  afterAll(async () => {
    await fse.remove(tmpDir)
  })

  it('应返回 true：所有文件/目录/软链均存在', async () => {
    expect(await isExist(fileA, fileB, dirA, symlinkA)).toBe(true)
  })

  it('应返回 true：仅目录存在', async () => {
    expect(await isExist(onlyDir)).toBe(true)
  })

  it('应返回 true：仅软链存在', async () => {
    expect(await isExist(onlySymlink)).toBe(true)
  })

  it('应返回 false：部分路径不存在', async () => {
    expect(await isExist(fileA, path.join(tmpDir, 'notExist.txt'))).toBe(false)
  })

  it('应返回 false：参数为空', async () => {
    expect(await isExist()).toBe(false)
  })

  it('应抛出异常：路径包含 glob 模式', async () => {
    await expect(isExist(fileA, '*.txt')).rejects.toThrow(/invalid path/)
  })

  it('应支持数组参数混合', async () => {
    expect(await isExist([fileA, fileB], dirA)).toBe(true)
  })

  it('应返回 false：数组参数中有不存在项', async () => {
    expect(await isExist([fileA, 'notExist.txt'])).toBe(false)
  })

  it('应返回 false：路径为空字符串', async () => {
    expect(await isExist('')).toBe(false)
  })

  it('应返回 false：normalizePath 过滤后长度变化', async () => {
    expect(await isExist(['', fileA])).toBe(false)
  })

  it('应返回 false：符号链接目标不存在', async () => {
    expect(await isExist(symlinkBroken)).toBe(false)
  })

  it('应处理动态文件状态变化', async () => {
    // 测试删除后重新创建
    await fse.remove(dirA)
    expect(await isExist(dirA)).toBe(false)
    await fse.ensureDir(dirA)
    expect(await isExist(dirA)).toBe(true)
  })

  it('应处理特殊路径场景', async () => {
    // 特殊字符路径
    expect(await isExist(specialFile)).toBe(true)

    // 软链循环
    expect(await isExist(cycleSymlink)).toBe(false)

    // 绝对路径
    expect(await isExist(path.resolve(fileA))).toBe(true)

    // 相对路径
    const relPath = path.relative(process.cwd(), fileA)
    expect(await isExist(relPath)).toBe(true)

    // 重复路径检测
    expect(await isExist(fileA, fileA)).toBe(true)
    expect(await isExist(fileA, 'notExist.txt', fileA)).toBe(false)

    // 不存在的文件
    const readonlyFile = path.join(tmpDir, 'readonly.txt')
    expect(await isExist(readonlyFile)).toBe(false)
  })
})
