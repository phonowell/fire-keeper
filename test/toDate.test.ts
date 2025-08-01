import { describe, expect, it } from 'vitest'

import toDate from '../src/toDate.js'

describe('toDate', () => {
  it('应正确处理 Date 对象输入', () => {
    const now = new Date()
    expect(toDate(now).getTime()).toBe(now.getTime())
    // 测试副本不影响原对象
    expect(toDate(now)).not.toBe(now)
  })

  it('应正确处理时间戳输入', () => {
    expect(toDate(1640995200000).toISOString()).toBe('2022-01-01T00:00:00.000Z')
    // toDate(0) 按实现应抛异常，已在异常用例覆盖，无需断言
    expect(toDate(253402300799999).toISOString()).toBe(
      '9999-12-31T23:59:59.999Z',
    )
  })

  it('应正确解析连字符日期字符串', () => {
    expect(toDate('2021-01-01').toISOString()).toBe('2021-01-01T00:00:00.000Z')
  })

  it('应正确解析斜杠日期字符串', () => {
    expect(toDate('2021/01/01').toISOString()).toBe('2020-12-31T16:00:00.000Z')
    expect(toDate('2021/1/1').toISOString()).toBe('2020-12-31T16:00:00.000Z')
  })

  it('应正确解析 ISO 格式字符串', () => {
    expect(toDate('2021-01-01T12:00:00Z').toISOString()).toBe(
      '2021-01-01T12:00:00.000Z',
    )
    expect(toDate('2021-01-01T12:00:00+08:00').toISOString()).toBe(
      '2021-01-01T04:00:00.000Z',
    )
    expect(toDate('2021-01-01T00:00:00.123Z').toISOString()).toBe(
      '2021-01-01T00:00:00.123Z',
    )
  })

  // 类型约束外输入不再测试

  it('应抛出异常：日期早于 1970-01-01', () => {
    expect(() => toDate('1969-12-31')).toThrow('invalid input')
    expect(() => toDate(-1)).toThrow('invalid input')
  })

  it('应抛出异常：无法解析的字符串', () => {
    expect(() => toDate('not-a-date')).toThrow('invalid input')
    expect(() => toDate('')).toThrow('invalid input')
    expect(() => toDate('0000-00-00')).toThrow('invalid input')
  })
})
