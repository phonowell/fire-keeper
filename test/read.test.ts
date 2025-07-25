import path from 'path'

import fse from 'fs-extra'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import echo from '../src/echo.js'
import read from '../src/read.js'

// Mock echo to avoid console output during tests
vi.mock('../src/echo.js')

describe('read', () => {
  const tempDir = path.join(process.cwd(), 'temp')
  const txtFile = path.join(tempDir, 'test.txt')
  const jsonFile = path.join(tempDir, 'test.json')
  const yamlFile = path.join(tempDir, 'test.yaml')
  const binFile = path.join(tempDir, 'test.bin')
  const notExistFile = path.join(tempDir, 'not-exist.txt')

  beforeAll(async () => {
    vi.mocked(echo).mockImplementation(() => undefined)

    await fse.ensureDir(tempDir)
    await fse.writeFile(txtFile, 'hello world')
    await fse.writeFile(jsonFile, JSON.stringify({ foo: 'bar' }))
    await fse.writeFile(yamlFile, 'foo: bar')
    await fse.writeFile(binFile, Buffer.from([1, 2, 3, 4]))
  })

  afterAll(async () => {
    try {
      await fse.remove(tempDir)
    } catch {}
  })

  it('应读取文本文件为字符串', async () => {
    const result = await read(txtFile)
    expect(result).toBe('hello world')
    expect(typeof result).toBe('string')
  })

  it('应读取 JSON 文件为对象', async () => {
    const result = await read(jsonFile)
    expect(result).toEqual({ foo: 'bar' })
    expect(typeof result).toBe('object')
  })

  it('应读取 YAML 文件为对象', async () => {
    const result = await read(yamlFile)
    expect(result).toEqual({ foo: 'bar' })
    expect(typeof result).toBe('object')
  })

  it('应读取二进制文件为 Buffer', async () => {
    const result = await read(binFile)
    expect(Buffer.isBuffer(result)).toBe(true)
    expect(result).toEqual(Buffer.from([1, 2, 3, 4]))
  })

  it('raw 选项应返回 Buffer', async () => {
    const result = await read(txtFile, { raw: true })
    expect(Buffer.isBuffer(result)).toBe(true)
    expect(result?.toString()).toBe('hello world')
  })

  it('文件不存在应返回 undefined', async () => {
    const result = await read(notExistFile)
    expect(result).toBeUndefined()
  })

  it('应调用 echo 函数', async () => {
    await read(txtFile)
    expect(echo).toHaveBeenCalledWith('read', expect.stringContaining('read'))
  })

  it('不存在的文件应调用 echo 错误信息', async () => {
    await read(notExistFile)
    expect(echo).toHaveBeenCalledWith('read', expect.stringContaining('not existed'))
  })

  it('应支持 glob 模式匹配', async () => {
    // 创建多个文件用于 glob 测试
    const glob1 = path.join(tempDir, 'glob1.txt')
    const glob2 = path.join(tempDir, 'glob2.txt')

    await fse.writeFile(glob1, 'glob1')
    await fse.writeFile(glob2, 'glob2')

    const result = await read(path.join(tempDir, 'glob*.txt'))
    expect(typeof result).toBe('string')
    expect(['glob1', 'glob2']).toContain(result)

    // 清理
    await fse.remove(glob1)
    await fse.remove(glob2)
  })
})
