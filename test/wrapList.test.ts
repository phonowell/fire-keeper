import { describe, expect, it } from 'vitest'

import wrapList from '../src/wrapList.js'

describe('wrapList', () => {
  it('应处理字符串数组', () => {
    expect(wrapList(['a', 'b', 'c'])).toBe("'a', 'b', 'c'")
  })

  it('应处理数字数组', () => {
    expect(wrapList([1, 2, 3])).toBe("'1', '2', '3'")
  })

  it('应处理布尔值数组', () => {
    expect(wrapList([true, false])).toBe("'true', 'false'")
  })

  it('应处理单个字符串', () => {
    expect(wrapList('abc')).toBe("'abc'")
  })

  it('应处理单个数字', () => {
    expect(wrapList(123)).toBe("'123'")
  })

  it('应处理单个布尔值', () => {
    expect(wrapList(true)).toBe("'true'")
  })

  it('应处理对象', () => {
    expect(wrapList({ name: 'test' })).toBe('\'{"name":"test"}\'')
  })

  it('应处理数组中对象', () => {
    expect(wrapList([{ a: 1 }, { b: 2 }])).toBe('\'{"a":1}\', \'{"b":2}\'')
  })

  it('应处理 null 和 undefined', () => {
    expect(wrapList([null, undefined])).toBe(', ')
  })

  it('应处理混合类型', () => {
    expect(wrapList(['x', 1, true, null, undefined, { y: 2 }])).toBe(
      "'x', '1', 'true', , , '{\"y\":2}'",
    )
  })

  it('应处理空数组', () => {
    expect(wrapList([])).toBe('')
  })

  it('应处理空字符串', () => {
    expect(wrapList('')).toBe("''")
  })

  it('应处理空对象', () => {
    expect(wrapList({})).toBe("'{}'")
  })

  it('应处理嵌套对象', () => {
    expect(wrapList({ a: { b: 1 } })).toBe('\'{"a":{"b":1}}\'')
  })

  it('应处理数组嵌套', () => {
    expect(
      wrapList([
        [1, 2],
        [3, 4],
      ]),
    ).toBe("'[1,2]', '[3,4]'")
  })

  it('应处理 Symbol 类型', () => {
    // Symbol 会被 JSON.stringify 转为 undefined，结果应为 ''
    expect(wrapList(Symbol('s'))).toBe("''")
  })

  it('应处理 BigInt 类型', () => {
    // BigInt 会被 JSON.stringify 抛错，需捕获异常并返回空字符串
    expect(wrapList(BigInt(123))).toBe("''")
  })

  it('应处理特殊字符', () => {
    expect(wrapList(["a'b", 'c,d'])).toBe("'a\\'b', 'c,d'")
  })

  it('应处理 NaN 和 Infinity', () => {
    expect(wrapList([NaN, Infinity, -Infinity])).toBe(
      "'NaN', 'Infinity', '-Infinity'",
    )
  })
})
