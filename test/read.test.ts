import path from 'path'

import fse from 'fs-extra'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import read from '../src/read.js'

describe('read', () => {
  const tempDir = path.join(process.cwd(), 'temp', 'read')
  const txtFile = path.join(tempDir, 'test.txt')
  const jsonFile = path.join(tempDir, 'test.json')
  const yamlFile = path.join(tempDir, 'test.yaml')
  const binFile = path.join(tempDir, 'test.bin')
  const notExistFile = path.join(tempDir, 'not-exist.txt')

  beforeAll(async () => {
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

  it('应支持 glob 模式匹配', async () => {
    const glob1 = path.join(tempDir, 'glob1.txt')
    const glob2 = path.join(tempDir, 'glob2.txt')

    await fse.writeFile(glob1, 'glob1')
    await fse.writeFile(glob2, 'glob2')

    const result = await read(path.join(tempDir, 'glob*.txt'))
    // read 只返回第一个匹配文件内容，需判断类型
    if (typeof result === 'string') expect(['glob1', 'glob2']).toContain(result)
    else throw new Error('glob 匹配应返回字符串')

    await fse.remove(glob1)
    await fse.remove(glob2)
  })
})
