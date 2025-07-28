import path from 'path'

import fs from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import remove from '../src/remove.js'

const tempDir = path.join(process.cwd(), 'temp/remove')

const tempFile = (name: string) => path.join(tempDir, name)

const ensureDirClean = async () => {
  await fs.remove(tempDir)
  await fs.ensureDir(tempDir)
}

describe('remove', () => {
  beforeEach(async () => {
    await ensureDirClean()
  })
  afterEach(async () => {
    await fs.remove(tempDir)
  })

  it('应删除单个文件', async () => {
    const file = tempFile('a.txt')
    await fs.outputFile(file, 'hello')
    expect(await fs.pathExists(file)).toBe(true)
    await remove(file)
    expect(await fs.pathExists(file)).toBe(false)
  })

  it('应删除多个文件', async () => {
    const files = ['b.txt', 'c.txt'].map(tempFile)
    await Promise.all(files.map((f) => fs.outputFile(f, 'x')))
    for (const f of files) expect(await fs.pathExists(f)).toBe(true)
    await remove(files)
    for (const f of files) expect(await fs.pathExists(f)).toBe(false)
  })

  it('应删除目录', async () => {
    const dir = tempFile('dir')
    await fs.ensureDir(dir)
    await fs.outputFile(path.join(dir, 'd.txt'), 'y')
    expect(await fs.pathExists(dir)).toBe(true)
    await remove(dir)
    expect(await fs.pathExists(dir)).toBe(false)
  })

  it('应支持通配符批量删除', async () => {
    const files = ['e1.txt', 'e2.txt', 'e3.txt'].map(tempFile)
    await Promise.all(files.map((f) => fs.outputFile(f, 'z')))
    await remove(path.join(tempDir, 'e*.txt'))
    for (const f of files) expect(await fs.pathExists(f)).toBe(false)
  })

  it('无匹配文件时应正常返回', async () => {
    await expect(remove(tempFile('notfound.txt'))).resolves.toBeUndefined()
  })

  it('应支持空数组输入', async () => {
    await expect(remove([])).resolves.toBeUndefined()
  })

  it('应支持重复路径及不存在文件删除', async () => {
    const file = tempFile('dup.txt')
    await fs.outputFile(file, '1')
    await remove([file, file, tempFile('not-exist.txt')])
    expect(await fs.pathExists(file)).toBe(false)
  })

  it('应支持并发参数', async () => {
    const files = ['f1.txt', 'f2.txt', 'f3.txt', 'f4.txt'].map(tempFile)
    await Promise.all(files.map((f) => fs.outputFile(f, 'c')))
    await remove(files, { concurrency: 2 })
    for (const f of files) expect(await fs.pathExists(f)).toBe(false)
  })

  it('应递归删除多级目录', async () => {
    const dir = tempFile('deep')
    const sub = path.join(dir, 'sub')
    await fs.ensureDir(sub)
    await fs.outputFile(path.join(sub, 'deep.txt'), 'deep')
    expect(await fs.pathExists(dir)).toBe(true)
    await remove(dir)
    expect(await fs.pathExists(dir)).toBe(false)
  })
})
