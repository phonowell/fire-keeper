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
    // 多字符 chars 部分匹配，只有末尾全为 chars 中字符才会被去除
    expect(trimEnd('foobar', 'ab')).toBe('foobar')
    expect(trimEnd('foobar', 'ba')).toBe('foobar')
    // chars 含特殊字符
    expect(trimEnd('foo\n\n', '\n')).toBe('foo')
    expect(trimEnd('foo\r\n', '\n\r')).toBe('foo')
    // chars 部分在末尾
    expect(trimEnd('abcxyz', 'xyz')).toBe('abc')
    // chars 仅部分在末尾，不会被去除
    expect(trimEnd('abcxyz', 'xy')).toBe('abcxyz')
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
    expect(trimEnd('foo', 'fo')).toBe('') // 多字符全部在末尾
    expect(trimEnd('foo', 'f')).toBe('foo') // 仅首字符
  })

  // 类型错误相关用例已移除，遵循仅测试当前模块功能的要求
})
