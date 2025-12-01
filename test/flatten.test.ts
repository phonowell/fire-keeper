import { describe, expect, it } from 'vitest'

import flatten from '../src/flatten.js'

describe('flatten', () => {
  it('基础展开与递归', () => {
    expect(flatten([1, [2, 3], 4])).toEqual([1, 2, 3, 4])
    expect(flatten([1, [2, [3, [4]]], 5])).toEqual([1, 2, 3, 4, 5])
    expect(flatten([[[[[[1]]]]]])).toEqual([1])
    expect(flatten([1, 2, 3])).toEqual([1, 2, 3])
    expect(flatten([])).toEqual([])
    expect(flatten([[], [[]], []])).toEqual([])
    expect(flatten([[1], [2], [3]])).toEqual([1, 2, 3])
  })

  it('支持对象类型', () => {
    const a = { id: 1 }
    const b = { id: 2 }
    const c = { id: 3 }
    expect(flatten([a, [b], [c]])).toEqual([a, b, c])
    expect(flatten([[[a]], [[b]]])).toEqual([a, b])
  })

  it('支持混合类型与null/undefined', () => {
    const arr: (
      | number
      | string
      | boolean
      | null
      | undefined
      | (number | string | boolean | null | undefined)[]
    )[] = [1, ['a', true], null, undefined]
    expect(flatten(arr)).toEqual([1, 'a', true, null, undefined])

    const arr2: (undefined | null | (undefined | null)[])[] = [
      undefined,
      [null],
      [undefined],
    ]
    expect(flatten(arr2)).toEqual([undefined, null, undefined])
  })

  it('路径字符串数组展开', () => {
    const files = ['./package.json', ['./README.md', ['./tsconfig.json']]]
    const flat = flatten(files)
    expect(flat).toEqual(['./package.json', './README.md', './tsconfig.json'])
    expect(flat).toHaveLength(3)
  })
})
