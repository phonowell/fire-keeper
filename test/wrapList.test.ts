import { describe, expect, it } from 'vitest'

import wrapList from '../src/wrapList.js'

describe('wrapList', () => {
  it('字符串数组', () => {
    expect(wrapList(['a', 'b', 'c'])).toBe('**a**, **b**, **c**')
  })

  it('单个字符串', () => {
    expect(wrapList('abc')).toBe('**abc**')
  })

  it('对象', () => {
    expect(wrapList({ name: 'test' })).toBe('**{"name":"test"}**')
  })

  it('数组中对象', () => {
    expect(wrapList([{ a: 1 }, { b: 2 }])).toBe('**{"a":1}**, **{"b":2}**')
  })

  it('混合类型', () => {
    expect(wrapList(['x', 1, true, null, undefined, { y: 2 }])).toBe(
      '**x**, **1**, **true**, , , **{"y":2}**',
    )
  })

  it('空数组', () => {
    expect(wrapList([])).toBe('')
  })

  it('空字符串', () => {
    expect(wrapList('')).toBe('****')
  })

  it('空对象', () => {
    expect(wrapList({})).toBe('**{}**')
  })

  it('嵌套对象', () => {
    expect(wrapList({ a: { b: 1 } })).toBe('**{"a":{"b":1}}**')
  })

  it('特殊字符', () => {
    expect(wrapList(["a'b", 'c,d'])).toBe("**a'b**, **c,d**")
  })
})
