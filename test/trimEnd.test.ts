import { describe, expect, it } from 'vitest'

import trimEnd from '../src/trimEnd.js'

describe('trimEnd', () => {
  it('应去除末尾空白字符', () => {
    expect(trimEnd('  hello  ')).toBe('  hello')
    expect(trimEnd('hello\t\n')).toBe('hello')
    expect(trimEnd('hello ')).toBe('hello')
    expect(trimEnd('hello')).toBe('hello')
    expect(trimEnd('   ', undefined)).toBe('')
  })

  it('应去除末尾指定字符', () => {
    expect(trimEnd('hello...', '.')).toBe('hello')
    expect(trimEnd('hello123', '123')).toBe('hello')
    expect(trimEnd('hello世界', '世界')).toBe('hello')
    expect(trimEnd('hello\n\t', '\n\t')).toBe('hello')
    expect(trimEnd('abc---', '-')).toBe('abc')
    expect(trimEnd('abc***', '*')).toBe('abc')
    expect(trimEnd('foo$$$', '$')).toBe('foo')
    expect(trimEnd('bar^^^', '^')).toBe('bar')
    expect(trimEnd('baz[]', '[]')).toBe('baz')
    expect(trimEnd('qux$^', '$^')).toBe('qux')
    expect(trimEnd('emoji😊😊', '😊')).toBe('emoji')
  })

  it('边界与特殊情况', () => {
    expect(trimEnd('', '.')).toBe('')
    expect(trimEnd('...', '.')).toBe('')
    expect(trimEnd('世界世界', '世界')).toBe('')
    expect(trimEnd('abc', 'x')).toBe('abc')
    expect(trimEnd('foo', '')).toBe('foo') // chars为空字符串
    expect(trimEnd('foo', undefined)).toBe('foo') // chars未定义
    expect(trimEnd('foo', 'o')).toBe('f')
    expect(trimEnd('foo', 'of')).toBe('') // 多字符全部在末尾
    expect(trimEnd('foo', 'z')).toBe('foo') // chars不在末尾
    expect(trimEnd('foo', 'o')).toBe('f')
    expect(trimEnd('foo', 'fo')).toBe('') // 多字符全部在末尾
    expect(trimEnd('foo', 'f')).toBe('foo') // 仅首字符
    expect(trimEnd('😊😊😊', '😊')).toBe('')
    expect(trimEnd('abc😊', '😊')).toBe('abc')
  })

  it('类型安全', () => {
    // @ts-expect-error 非字符串类型不允许
    expect(() => trimEnd(123 as unknown as string)).toThrow()
    // @ts-expect-error chars 非字符串类型不允许
    expect(() => trimEnd('abc', 123 as unknown as string)).toThrow()
  })
})
