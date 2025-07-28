import { describe, expect, it } from 'vitest'

import wrapList from '../src/wrapList.js'

describe('wrapList', () => {
  it('字符串数组', () => {
    expect(wrapList(['a', 'b', 'c'])).toBe("'a', 'b', 'c'")
  })

  it('数字数组', () => {
    expect(wrapList([1, 2, 3])).toBe("'1', '2', '3'")
  })

  it('布尔数组', () => {
    expect(wrapList([true, false])).toBe("'true', 'false'")
  })

  it('单个字符串', () => {
    expect(wrapList('abc')).toBe("'abc'")
  })

  it('单个数字', () => {
    expect(wrapList(123)).toBe("'123'")
  })

  it('单个布尔', () => {
    expect(wrapList(true)).toBe("'true'")
  })

  it('对象', () => {
    expect(wrapList({ name: 'test' })).toBe('\'{"name":"test"}\'')
  })

  it('数组中对象', () => {
    expect(wrapList([{ a: 1 }, { b: 2 }])).toBe('\'{"a":1}\', \'{"b":2}\'')
  })

  it('null 和 undefined', () => {
    expect(wrapList([null, undefined])).toBe(', ')
  })

  it('混合类型', () => {
    expect(wrapList(['x', 1, true, null, undefined, { y: 2 }])).toBe(
      "'x', '1', 'true', , , '{\"y\":2}'",
    )
  })

  it('空数组', () => {
    expect(wrapList([])).toBe('')
  })

  it('空字符串', () => {
    expect(wrapList('')).toBe("''")
  })

  it('空对象', () => {
    expect(wrapList({})).toBe("'{}'")
  })

  it('嵌套对象', () => {
    expect(wrapList({ a: { b: 1 } })).toBe('\'{"a":{"b":1}}\'')
  })

  it('数组嵌套', () => {
    expect(
      wrapList([
        [1, 2],
        [3, 4],
      ]),
    ).toBe("'[1,2]', '[3,4]'")
  })

  it('Symbol 类型', () => {
    expect(wrapList(Symbol('s'))).toBe("'undefined'")
  })

  it('特殊字符', () => {
    expect(wrapList(["a'b", 'c,d'])).toBe("'a'b', 'c,d'")
  })

  it('NaN 和 Infinity', () => {
    expect(wrapList([NaN, Infinity, -Infinity])).toBe(
      "'NaN', 'Infinity', '-Infinity'",
    )
  })
})
