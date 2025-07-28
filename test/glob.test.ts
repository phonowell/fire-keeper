import fs from 'fs/promises'
import path from 'path'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import glob from '../src/glob.js'

const tempDir = './temp/glob'

const setupTemp = async () => {
  await fs.mkdir(`${tempDir}/subdir`, { recursive: true })
  await fs.mkdir(`${tempDir}/subdir2`, { recursive: true })
  await Promise.all([
    fs.writeFile(`${tempDir}/.dotfile`, 'dot'),
    fs.writeFile(`${tempDir}/normal.txt`, 'txt'),
    fs.writeFile(`${tempDir}/subdir/file1.ts`, 'ts'),
    fs.writeFile(`${tempDir}/subdir/.hidden`, 'hidden'),
    fs.writeFile(`${tempDir}/subdir2/file2.ts`, 'ts2'),
    fs.writeFile(`${tempDir}/subdir2/file3.js`, 'js3'),
  ])
}
const cleanupTemp = async () => {
  await fs.rm(tempDir, { recursive: true, force: true })
}

describe('glob', () => {
  beforeAll(setupTemp)
  afterAll(cleanupTemp)

  it('基本模式匹配', async () => {
    const result = await glob('src/*.ts')
    expect(Array.isArray(result)).toBe(true)
    expect(result.some((p) => p.endsWith('src/glob.ts'))).toBe(true)
  })

  it('数组模式与排除', async () => {
    const result = await glob(['src/*.ts', '!src/*.test.ts'])
    expect(result.every((p) => !p.endsWith('.test.ts'))).toBe(true)
  })

  it('返回绝对路径', async () => {
    const result = await glob('src/*.ts', { absolute: true })
    expect(result.every((p) => path.isAbsolute(p))).toBe(true)
  })

  it('包含点文件', async () => {
    const result = await glob(`${tempDir}/.*`, { dot: true })
    expect(result.some((p) => p.endsWith('.dotfile'))).toBe(true)
  })

  it('只匹配文件', async () => {
    const result = await glob(`${tempDir}/subdir/*.ts`, { onlyFiles: true })
    expect(result.length).toBe(1)
    expect(result[0].endsWith('file1.ts')).toBe(true)
  })

  it('只匹配目录', async () => {
    const result = await glob(`${tempDir}/*`, { onlyDirectories: true })
    expect(result.some((p) => p.endsWith('subdir'))).toBe(true)
    expect(result.some((p) => p.endsWith('subdir2'))).toBe(true)
  })

  it('空输入返回空数组', async () => {
    expect((await glob('')).length).toBe(0)
    expect((await glob([])).length).toBe(0)
  })

  it('无匹配结果返回空数组', async () => {
    const result = await glob(`${tempDir}/not-exist.*`)
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(0)
  })

  it('深度限制', async () => {
    const result = await glob(`${tempDir}/**/*.ts`, { deep: 1 })
    expect(
      result.every((p) => p.endsWith('file1.ts') || p.endsWith('file2.ts')),
    ).toBe(true)
  })

  it('边界情况', async () => {
    expect((await glob([''])).length).toBe(0)
    expect((await glob('not_exist_dir/*')).length).toBe(0)
    const result = await glob(`${tempDir}/subdir/*[a-z]*.ts`)
    expect(result.length).toBe(1)
    expect(result[0].endsWith('file1.ts')).toBe(true)
  })

  it('options 组合', async () => {
    const result = await glob(
      [`${tempDir}/subdir/*.ts`, `!${tempDir}/subdir/*.js`],
      {
        absolute: true,
        dot: true,
        onlyFiles: true,
        deep: 1,
      },
    )
    expect(result.every((p) => path.isAbsolute(p))).toBe(true)
    expect(result.every((p) => p.endsWith('.ts'))).toBe(true)
  })
})
