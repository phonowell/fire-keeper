import path from 'path'

import fse from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import copy from '../src/copy.js'

const tempDir = path.join(process.cwd(), 'temp', 'copy')
const tempFile = (name: string) => path.join(tempDir, name)

describe('copy', () => {
  beforeEach(async () => {
    await fse.ensureDir(tempDir)
  })
  afterEach(async () => {
    await fse.emptyDir(tempDir)
  })

  it('应正常复制单个文件，自动生成.copy文件', async () => {
    const src = tempFile('a.txt')
    await fse.writeFile(src, 'hello')
    await copy(src)
    expect(await fse.readFile(tempFile('a.copy.txt'), 'utf8')).toBe('hello')
  })

  it('应支持目标目录为字符串/函数/异步函数', async () => {
    const src = tempFile('b.txt')
    await fse.writeFile(src, 'world')
    const dist = tempFile('dist')
    await fse.ensureDir(dist)
    await copy(src, dist)
    expect(await fse.readFile(path.join(dist, 'b.txt'), 'utf8')).toBe('world')

    const distFn = tempFile('dist_fn')
    await fse.ensureDir(distFn)
    await copy(src, () => distFn)
    expect(await fse.readFile(path.join(distFn, 'b.txt'), 'utf8')).toBe('world')

    const distAsync = tempFile('dist_async')
    await copy(src, async () => {
      await fse.ensureDir(distAsync)
      return distAsync
    })
    expect(await fse.readFile(path.join(distAsync, 'b.txt'), 'utf8')).toBe(
      'world',
    )
  })

  it('应支持 options 为字符串/函数/异步函数/对象', async () => {
    const src = tempFile('c.txt')
    await fse.writeFile(src, 'rename')
    await copy(src, undefined, 'renamed.txt')
    expect(await fse.readFile(tempFile('renamed.txt'), 'utf8')).toBe('rename')

    await copy(src, undefined, (name: string) =>
      Promise.resolve(`async_${name}`),
    )
    expect(await fse.readFile(tempFile('async_c.txt'), 'utf8')).toBe('rename')

    await copy(src, undefined, { filename: 'fixed.txt' })
    expect(await fse.readFile(tempFile('fixed.txt'), 'utf8')).toBe('rename')

    await copy(src, undefined, { filename: (name: string) => `fn_${name}` })
    expect(await fse.readFile(tempFile('fn_c.txt'), 'utf8')).toBe('rename')
  })

  it('应支持多文件复制及并发参数', async () => {
    const src1 = tempFile('d.txt')
    const src2 = tempFile('e.txt')
    await fse.writeFile(src1, 'd')
    await fse.writeFile(src2, 'e')
    await copy([src1, src2])
    expect(await fse.readFile(tempFile('d.copy.txt'), 'utf8')).toBe('d')
    expect(await fse.readFile(tempFile('e.copy.txt'), 'utf8')).toBe('e')

    await copy([src1, src2], undefined, { concurrency: 2 })
    expect(await fse.pathExists(tempFile('d.copy.txt'))).toBe(true)
    expect(await fse.pathExists(tempFile('e.copy.txt'))).toBe(true)
  })

  it('目标目录不存在时自动创建', async () => {
    const src = tempFile('f.txt')
    await fse.writeFile(src, 'auto')
    const newDir = tempFile('newdir')
    await copy(src, newDir)
    expect(await fse.readFile(path.join(newDir, 'f.txt'), 'utf8')).toBe('auto')
  })

  it('覆盖已有文件', async () => {
    const src = tempFile('g.txt')
    await fse.writeFile(src, 'old')
    const target = tempFile('g.copy.txt')
    await fse.writeFile(target, 'will be replaced')
    await copy(src)
    expect(await fse.readFile(target, 'utf8')).toBe('old')
  })
})
