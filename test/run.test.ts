import { describe, expect, it } from 'vitest'

import run from '../src/run.js'

describe('run', () => {
  it('应返回各种类型的函数结果', () => {
    expect(run(() => 42)).toBe(42)
    expect(run(() => 'hello')).toBe('hello')
    expect(run(() => undefined)).toBeUndefined()
    expect(run(() => null)).toBeNull()
    expect(run(() => [1, 2, 3])).toEqual([1, 2, 3])
    expect(run(() => [])).toEqual([])
    expect(run(() => ({}))).toEqual({})
    expect(run(() => 'no args')).toBe('no args')
  })

  it('应支持泛型与类型推断', () => {
    type User = { id: number; name: string }
    const user = run<User>(() => ({ id: 1, name: 'Alice' }))
    expect(user).toEqual({ id: 1, name: 'Alice' })

    type Nested = { user: { id: number; info: { name: string } } }
    const nested = run<Nested>(() => ({
      user: { id: 1, info: { name: 'Bob' } },
    }))
    expect(nested).toEqual({ user: { id: 1, info: { name: 'Bob' } } })

    // 推断类型
    const result = run(() => ({ foo: 'bar' }))
    expect(result).toEqual({ foo: 'bar' })
    type TestType = typeof result
    const check: TestType = { foo: 'bar' }
    expect(check).toEqual(result)
  })

  it('应支持函数返回函数', () => {
    const fn = run(() => () => 123)
    expect(fn()).toBe(123)
    const typedFn = run<() => string>(() => () => 'abc')
    expect(typedFn()).toBe('abc')
  })

  it('应抛出异常时能捕获', () => {
    expect(() =>
      run(() => {
        throw new Error('test error')
      }),
    ).toThrow('test error')
  })
})
