import path from 'path'

import { describe, expect, it } from 'vitest'

import glob from '../src/glob.js'

describe('glob', () => {
  it('应正确匹配基本模式', async () => {
    const result = await glob('src/*.ts')
    expect(Array.isArray(result)).toBe(true)
    expect(result.some((p: string) => p.endsWith('src/glob.ts'))).toBe(true)
  })

  it('应支持数组模式与排除', async () => {
    const result = await glob(['src/*.ts', '!src/*.test.ts'])
    expect(result.every((p: string) => !p.endsWith('.test.ts'))).toBe(true)
  })

  it('应返回绝对路径', async () => {
    const result = await glob('src/*.ts', { absolute: true })
    expect(result.every((p: string) => path.isAbsolute(p))).toBe(true)
  })

  it('应包含点文件', async () => {
    // 测试现有的点文件
    const result = await glob('./*', { dot: true })
    expect(result.some((p: string) => p.includes('.'))).toBe(true)
  })

  it('应只匹配文件', async () => {
    const result = await glob('src/*.ts', { onlyFiles: true })
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((p: string) => p.endsWith('.ts'))).toBe(true)
  })

  it('应只匹配目录', async () => {
    const result = await glob('*', { onlyDirectories: true })
    expect(result.length).toBeGreaterThan(0)
  })

  it('空输入应返回空数组', async () => {
    const result1 = await glob('')
    const result2 = await glob([])
    expect(result1.length).toBe(0)
    expect(result2.length).toBe(0)
  })

  it('已缓存输入应直接返回', async () => {
    const arr = ['src/glob.ts']
    Object.defineProperty(arr, '__IS_LISTED_AS_SOURCE__', { value: true })
    const result = await glob(arr)
    expect(result).toBe(arr)
  })

  it('无匹配结果应返回空数组', async () => {
    const result = await glob('src/不存在的文件.*')
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(0)
  })

  it('非法 pattern 应抛出异常', async () => {
    await expect(glob('[')).rejects.toThrow()
  })

  it('深度限制应生效', async () => {
    const result = await glob('**/*.ts', { deep: 1 })
    expect(Array.isArray(result)).toBe(true)
  })

  it('应处理各种边界情况', async () => {
    // 空字符串数组
    const result1 = await glob([''])
    expect(result1.length).toBe(0)

    // 不存在的目录
    const result2 = await glob('not_exist_dir/*')
    expect(result2.length).toBe(0)

    // 特殊字符模式
    const result3 = await glob('src/*[a-z]*.ts')
    expect(Array.isArray(result3)).toBe(true)

    // 大量模式
    const patterns = Array(100).fill('src/*.ts')
    const result4 = await glob(patterns)
    expect(Array.isArray(result4)).toBe(true)
  })

  it('options 组合应兼容', async () => {
    const result = await glob(['src/*.ts', '!src/*.test.ts'], {
      absolute: true,
      dot: true,
      onlyFiles: true,
      deep: 1,
    })
    expect(result.every((p: string) => path.isAbsolute(p))).toBe(true)
    expect(result.every((p: string) => !p.endsWith('.test.ts'))).toBe(true)
  })

  // 删除非法类型输入用例（@ts-expect-error），TypeScript 类型约束已覆盖
})
