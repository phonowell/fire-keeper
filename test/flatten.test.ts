import fs from 'fs'
import path from 'path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import flatten from '../src/flatten.js'

describe('flatten', () => {
  it('应正确展开一层嵌套数组', () => {
    expect(flatten([1, [2, 3], 4])).toEqual([1, 2, 3, 4])
  })

  it('应递归展开多层嵌套数组', () => {
    expect(flatten([1, [2, [3, [4]]], 5])).toEqual([1, 2, 3, 4, 5])
  })

  it('应处理空数组', () => {
    expect(flatten([])).toEqual([])
  })

  it('应处理已扁平化数组', () => {
    expect(flatten([1, 2, 3])).toEqual([1, 2, 3])
  })

  it('应处理包含对象的嵌套数组', () => {
    const a = { id: 1 }
    const b = { id: 2 }
    const c = { id: 3 }
    expect(flatten([a, [b], [c]])).toEqual([a, b, c])
  })

  it('应处理混合类型（number/string/boolean/null/undefined）', () => {
    const arr: (
      | number
      | string
      | boolean
      | null
      | undefined
      | (number | string | boolean | null | undefined)[]
    )[] = [1, ['a', true], null, undefined]
    expect(flatten(arr)).toEqual([1, 'a', true, null, undefined])
  })

  it('应处理嵌套空数组', () => {
    expect(flatten([[], [[]], []])).toEqual([])
  })

  it('应处理仅包含 undefined/null 的数组', () => {
    const arr: (undefined | null | (undefined | null)[])[] = [
      undefined,
      [null],
      [undefined],
    ]
    expect(flatten(arr)).toEqual([undefined, null, undefined])
  })

  it('应处理深层嵌套对象', () => {
    const a = { id: 1 }
    const b = { id: 2 }
    expect(flatten([[[a]], [[b]]])).toEqual([a, b])
  })

  it('应处理深层嵌套 Symbol', () => {
    const s = Symbol('deep')
    expect(flatten([[[s]]])).toEqual([s])
    const s2 = Symbol('mix')
    expect(flatten([[s], [s2]])).toEqual([s, s2])
  })

  it('应处理深层嵌套函数', () => {
    const fn = () => 42
    expect(flatten([[[fn]]])).toEqual([fn])
  })

  it('应处理只含数组元素', () => {
    expect(flatten([[1], [2], [3]])).toEqual([1, 2, 3])
  })

  it('应处理深度嵌套', () => {
    expect(flatten([[[[[[1]]]]]])).toEqual([1])
  })

  it('应支持泛型类型推断', () => {
    const arr: Array<number | number[]> = [1, [2, 3], 4]
    const result = flatten(arr)
    expect(result).toEqual([1, 2, 3, 4])
    type Test = typeof result extends number[] ? true : false
    const typeCheck: Test = true
    expect(typeCheck).toBe(true)
  })

  describe('临时文件路径数组展开', () => {
    const tempDir = path.join(process.cwd(), 'temp')
    const files = [
      path.join(tempDir, 'a.txt'),
      [path.join(tempDir, 'b.txt'), [path.join(tempDir, 'c.txt')]],
    ]
    beforeEach(() => {
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)
      fs.writeFileSync(path.join(tempDir, 'a.txt'), 'A')
      fs.writeFileSync(path.join(tempDir, 'b.txt'), 'B')
      fs.writeFileSync(path.join(tempDir, 'c.txt'), 'C')
    })
    afterEach(() => {
      fs.rmSync(tempDir, { recursive: true, force: true })
    })
    it('应正确展开文件路径数组', () => {
      const flat = flatten(files)
      expect(flat).toEqual([
        path.join(tempDir, 'a.txt'),
        path.join(tempDir, 'b.txt'),
        path.join(tempDir, 'c.txt'),
      ])
      flat.forEach((f) => {
        if (typeof f === 'string') expect(fs.existsSync(f)).toBe(true)
      })
    })
  })

  it('应处理特殊对象（Date、RegExp）', () => {
    const arr: (Date | RegExp | (Date | RegExp)[])[] = [new Date(), [/\d+/]]
    const result = flatten(arr)
    expect(result.length).toBe(2)
    expect(result[0] instanceof Date || result[0] instanceof RegExp).toBe(true)
    expect(result[1] instanceof Date || result[1] instanceof RegExp).toBe(true)
    const deepArr: (Date | RegExp | (Date | RegExp)[])[] = [
      [new Date()],
      [/\w+/],
    ]
    const deepResult = flatten(deepArr)
    expect(deepResult.length).toBe(2)
    expect(
      deepResult[0] instanceof Date || deepResult[0] instanceof RegExp,
    ).toBe(true)
    expect(
      deepResult[1] instanceof Date || deepResult[1] instanceof RegExp,
    ).toBe(true)
  })
})
