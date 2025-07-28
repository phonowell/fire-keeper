import path from 'path'

import fse from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import link from '../src/link.js'

const tempDir = path.join(process.cwd(), 'temp')

const tempFile = (name: string) => path.join(tempDir, name)

const cleanup = async (paths: string[]) => {
  for (const p of paths) {
    try {
      await fse.remove(p)
    } catch {}
  }
}

describe('link', () => {
  beforeEach(async () => {
    await fse.ensureDir(tempDir)
    await cleanup([
      tempFile('src-file.txt'),
      tempFile('dest-link.txt'),
      tempFile('src-dir'),
      tempFile('dest-dir-link'),
    ])
  })
  afterEach(async () => {
    await cleanup([
      tempFile('src-file.txt'),
      tempFile('dest-link.txt'),
      tempFile('src-dir'),
      tempFile('dest-dir-link'),
    ])
  })

  it('应能创建文件符号链接', async () => {
    const src = tempFile('src-file.txt')
    const dest = tempFile('dest-link.txt')
    await fse.writeFile(src, 'hello')
    await link(src, dest)
    const stat = await fse.lstat(dest)
    expect(stat.isSymbolicLink()).toBe(true)
    const linked = await fse.readFile(dest, 'utf8')
    expect(linked).toBe('hello')
  })

  it('应能创建目录符号链接', async () => {
    const srcDir = tempFile('src-dir')
    const destDir = tempFile('dest-dir-link')
    await fse.ensureDir(srcDir)
    await fse.writeFile(path.join(srcDir, 'a.txt'), 'abc')
    await link(srcDir, destDir)
    const stat = await fse.lstat(destDir)
    expect(stat.isSymbolicLink()).toBe(true)
    const files = await fse.readdir(destDir)
    expect(files).toContain('a.txt')
    const content = await fse.readFile(path.join(destDir, 'a.txt'), 'utf8')
    expect(content).toBe('abc')
  })
})
