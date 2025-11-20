import { describe, expect, it } from 'vitest'

import toArray from '../src/toArray.js'

describe('toArray', () => {
  it('应将数字转换为数组', () => {
    expect(toArray(42)).toEqual([42])
    expect(toArray(-1)).toEqual([-1])
    expect(toArray(0)).toEqual([0])
  })

  it('应将字符串转换为数组', () => {
    expect(toArray('hello')).toEqual(['hello'])
    expect(toArray('')).toEqual([''])
  })

  it('应将对象转换为数组', () => {
    expect(toArray({ key: 'value' })).toEqual([{ key: 'value' }])
    expect(toArray({})).toEqual([{}])
  })

  it('应保持数组不变', () => {
    expect(toArray([1, 2, 3])).toEqual([1, 2, 3])
    expect(toArray(['a', 'b'])).toEqual(['a', 'b'])
    expect(toArray([])).toEqual([])
    expect(toArray([null, undefined])).toEqual([null, undefined])
  })

  it('应处理 null 和 undefined', () => {
    expect(toArray(null)).toEqual([null])
    expect(toArray(undefined)).toEqual([undefined])
  })

  it('应处理布尔值', () => {
    expect(toArray(true)).toEqual([true])
    expect(toArray(false)).toEqual([false])
  })

  it('应处理嵌套数组', () => {
    expect(toArray([[1, 2]])).toEqual([[1, 2]])
  })
})
