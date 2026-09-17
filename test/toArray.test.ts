import { describe, expect, it } from 'vitest'

import toArray from '../src/toArray.js'

describe('toArray', () => {
  it('非数组值应包装为单元素数组', () => {
    expect(toArray('a')).toEqual(['a'])
    expect(toArray(1)).toEqual([1])
    expect(toArray({ x: 1 })).toEqual([{ x: 1 }])
  })

  it('数组应保持不变', () => {
    expect(toArray([1, 2])).toEqual([1, 2])
    expect(toArray([])).toEqual([])
    expect(toArray(['a'])).toEqual(['a'])
  })
})
