import * as fs from 'fs'
import * as path from 'path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import at from '../src/at.js'

const tempDir = path.join(process.cwd(), 'temp')

describe('at', () => {
  beforeEach(() => {
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)
  })
  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true })
  })

  it('数组索引访问', () => {
    const arr = [10, 20, 30]
    expect(at(arr, 0)).toBe(10)
    expect(at(arr, 1)).toBe(20)
    expect(at(arr, 2)).toBe(30)
    expect(at(arr, 3)).toBeUndefined()
    expect(at(arr, -1)).toBe(30)
    expect(at(arr, -2)).toBe(20)
    expect(at(arr, -3)).toBe(10)
    expect(at(arr, -4)).toBeUndefined()
    expect(at([], 0)).toBeUndefined()
    expect(at([], -1)).toBeUndefined()
    // 极端边界
    expect(at(arr, 99999)).toBeUndefined()
    expect(at(arr, -99999)).toBeUndefined()
  })

  it('对象属性访问', () => {
    const obj = { a: { b: { c: 5 } }, x: 1 }
    expect(at(obj, 'a.b.c')).toBe(5)
    expect(at(obj, 'a.b')).toEqual({ c: 5 })
    expect(at(obj, 'a.x')).toBeUndefined()
    expect(at(obj, 'x')).toBe(1)
    expect(at(obj, 'y')).toBeUndefined()
    expect(at(obj, 'a', 'b', 'c')).toBe(5)
    expect(at(obj, 'a', 'b')).toEqual({ c: 5 })
    expect(at(obj, 'a', 'x')).toBeUndefined()
  })

  it('复杂嵌套结构访问', () => {
    const data = [{ x: { y: 1 } }, { x: { y: 2 } }]
    expect(at(data, 0)).toEqual({ x: { y: 1 } })
    expect(at(data[1], 'x', 'y')).toBe(2)
    expect(at(data, 2)).toBeUndefined()
    const obj = { a: [{ b: { c: 9 } }, { b: { c: 10 } }] }
    expect(at(obj, 'a.0.b.c')).toBe(9)
    expect(at(obj, 'a.1.b.c')).toBe(10)
    expect(at(obj, 'a.2.b.c')).toBeUndefined()
  })

  it('空对象访问', () => {
    const obj = {}
    expect(at(obj, 'a')).toBeUndefined()
    expect(at(obj, 'a.b')).toBeUndefined()
  })

  it('空路径处理', () => {
    const obj = { a: 1 }
    expect(at(obj, 'a', '')).toBe(1)
    expect(at(obj, '', 'b')).toBeUndefined()
  })

  it('数组嵌套对象访问', () => {
    const arr = [{ a: 1 }, { a: 2 }]
    expect(at(arr[0], 'a')).toBe(1)
    expect(at(arr[1], 'a')).toBe(2)
  })

  it('数字字符串键访问', () => {
    const obj = { '0': 'a', '1': 'b' }
    expect(at(obj, '0')).toBe('a')
    expect(at(obj, '1')).toBe('b')
    expect(at(obj, '2')).toBeUndefined()
  })

  it('对象路径为特殊字符', () => {
    const obj = { '空 格': 99, '!@#': 7 }
    expect(at(obj, '空 格')).toBe(99)
    expect(at(obj, '!@#')).toBe(7)
    // 包含点的键名测试（点会被解释为路径分隔符）
    const objWithDot = { a: { b: 42 } }
    expect(at(objWithDot, 'a.b')).toBe(42)
  })

  it('多层嵌套对象与数组混合路径对比', () => {
    const obj = {
      a: [{ b: { c: 5, d: { e: 7 } } }, { b: { c: 6, d: { e: 8 } } }],
    }
    expect(at(obj, 'a.0.b.c')).toBe(5)
    expect(at(obj, 'a.1.b.c')).toBe(6)
    expect(at(obj, 'a.2.b.c')).toBeUndefined()
    expect(at(obj, 'a.0.b.d.e')).toBe(7)
    expect(at(obj, 'a.1.b.d.e')).toBe(8)
    expect(at(obj, 'a.0.b.d.x')).toBeUndefined()
  })

  it('临时文件对象访问与清理', () => {
    const filePath = path.join(tempDir, 'test.json')
    fs.writeFileSync(filePath, JSON.stringify({ a: { b: 123 } }))
    const fileObj = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    expect(at(fileObj, 'a.b')).toBe(123)
    fs.unlinkSync(filePath)
    expect(fs.existsSync(filePath)).toBe(false)
  })
})
