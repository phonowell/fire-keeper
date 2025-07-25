import path from 'path'

import fse from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import copy from '../src/copy.js'
import echo from '../src/echo.js'
import glob from '../src/glob.js'

const tempDir = path.join(process.cwd(), 'temp')
const tempFile = (name: string) => path.join(tempDir, name)

const mockedGlob = vi.mocked(glob)
const mockedEcho = vi.mocked(echo)

describe('copy', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await fse.ensureDir(tempDir)
  })
  afterEach(async () => {
    await fse.emptyDir(tempDir)
  })

  it('应正常复制文件（真实文件）', async () => {
    const src = tempFile('a.txt')
    await fse.writeFile(src, 'hello')
    await copy(src)
    const copied = tempFile('a.copy.txt')
    expect(await fse.readFile(copied, 'utf8')).toBe('hello')
  })


  it('应支持目标目录为字符串', async () => {
    const src = tempFile('b.txt')
    await fse.writeFile(src, 'world')
    const dist = tempFile('dist')
    await fse.ensureDir(dist)
    await copy(src, dist)
    expect(await fse.readFile(path.join(dist, 'b.txt'), 'utf8')).toBe('world')
  })

  it('应支持目标目录为异步函数', async () => {
    const src = tempFile('b2.txt')
    await fse.writeFile(src, 'async')
    await copy(src, async (_dirname) => {
      const target = tempFile('dist_async')
      await fse.ensureDir(target)
      return target
    })
    expect(await fse.readFile(tempFile('dist_async/b2.txt'), 'utf8')).toBe(
      'async',
    )
  })

  it('应支持目标目录为函数', async () => {
    const src = tempFile('c.txt')
    await fse.writeFile(src, 'custom')
    const customDir = tempFile('custom')
    await fse.ensureDir(customDir)
    await copy(src, (_dirname) => customDir)
    expect(await fse.readFile(path.join(customDir, 'c.txt'), 'utf8')).toBe(
      'custom',
    )
  })

  it('应支持 options 为字符串（文件名）', async () => {
    const src = tempFile('d.txt')
    await fse.writeFile(src, 'rename')
    await copy(src, undefined, 'renamed.txt')
    expect(await fse.readFile(tempFile('renamed.txt'), 'utf8')).toBe('rename')
  })

  it('应支持 options 为异步函数（文件名）', async () => {
    const src = tempFile('d2.txt')
    await fse.writeFile(src, 'asyncname')
    await copy(src, undefined, (name: string) =>
      Promise.resolve(`async_${name}`),
    )
    expect(await fse.readFile(tempFile('async_d2.txt'), 'utf8')).toBe(
      'asyncname',
    )
  })

  it('应支持 options.filename 为字符串', async () => {
    const src = tempFile('e.txt')
    await fse.writeFile(src, 'fixed')
    await copy(src, undefined, { filename: 'fixed.txt' })
    expect(await fse.readFile(tempFile('fixed.txt'), 'utf8')).toBe('fixed')
  })

  it('应支持 options.filename 为异步函数', async () => {
    const src = tempFile('e2.txt')
    await fse.writeFile(src, 'asyncfixed')
    await copy(src, undefined, {
      filename: (name: string) => Promise.resolve(`async_${name}`),
    })
    expect(await fse.readFile(tempFile('async_e2.txt'), 'utf8')).toBe(
      'asyncfixed',
    )
  })

  it('应支持 options.filename 为函数', async () => {
    const src = tempFile('f.txt')
    await fse.writeFile(src, 'fnfixed')
    await copy(src, undefined, { filename: (name: string) => `fn_${name}` })
    expect(await fse.readFile(tempFile('fn_f.txt'), 'utf8')).toBe('fnfixed')
  })

  it('应支持多文件复制（真实文件）', async () => {
    const src1 = tempFile('g.txt')
    const src2 = tempFile('h.txt')
    await fse.writeFile(src1, 'g')
    await fse.writeFile(src2, 'h')
    await copy([src1, src2])
    expect(await fse.readFile(tempFile('g.copy.txt'), 'utf8')).toBe('g')
    expect(await fse.readFile(tempFile('h.copy.txt'), 'utf8')).toBe('h')
  })

  it('多文件复制时支持 target 为异步函数', async () => {
    const src1 = tempFile('g2.txt')
    const src2 = tempFile('h2.txt')
    await fse.writeFile(src1, 'g2')
    await fse.writeFile(src2, 'h2')
    await copy([src1, src2], async (_dirname) => {
      const target = tempFile('dist_async')
      await fse.ensureDir(target)
      return target
    })
    expect(await fse.readFile(tempFile('dist_async/g2.txt'), 'utf8')).toBe('g2')
    expect(await fse.readFile(tempFile('dist_async/h2.txt'), 'utf8')).toBe('h2')
  })

  it('应支持并发参数', async () => {
    const src1 = tempFile('i.txt')
    const src2 = tempFile('j.txt')
    await fse.writeFile(src1, 'i')
    await fse.writeFile(src2, 'j')
    await copy([src1, src2], undefined, { concurrency: 2 })
    expect(await fse.pathExists(tempFile('i.copy.txt'))).toBe(true)
    expect(await fse.pathExists(tempFile('j.copy.txt'))).toBe(true)
  })

  it('复制到不同目录下应保持原文件名', async () => {
    const src = tempFile('k.txt')
    await fse.writeFile(src, 'other')
    const other = tempFile('other')
    await fse.ensureDir(other)
    await copy(src, other)
    expect(await fse.readFile(path.join(other, 'k.txt'), 'utf8')).toBe('other')
  })


  it('目标目录不存在时自动创建', async () => {
    const src = tempFile('m.txt')
    await fse.writeFile(src, 'auto')
    const newDir = tempFile('newdir')
    await copy(src, newDir)
    expect(await fse.readFile(path.join(newDir, 'm.txt'), 'utf8')).toBe('auto')
  })

  it('覆盖已有文件', async () => {
    const src = tempFile('n.txt')
    await fse.writeFile(src, 'old')
    const target = tempFile('n.copy.txt')
    await fse.writeFile(target, 'will be replaced')
    await copy(src)
    expect(await fse.readFile(target, 'utf8')).toBe('old')
  })

})

