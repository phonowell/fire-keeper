import { describe, expect, it } from 'vitest'

import run from '../src/run.js'

describe('run', () => {
  it('应返回函数的返回值（数字）', () => {
    const result: number = run(() => 42)
    expect(result).toBe(42)
  })

  it('应返回函数的返回值（字符串）', () => {
    const result: string = run(() => 'hello')
    expect(result).toBe('hello')
  })

  it('应支持泛型类型推断', () => {
    type User = { id: number; name: string }
    const user: User = run<User>(() => ({ id: 1, name: 'Alice' }))
    expect(user).toEqual({ id: 1, name: 'Alice' })
  })

  it('应支持返回对象', () => {
    const obj: { a: number; b: number } = run(() => ({ a: 1, b: 2 }))
    expect(obj).toEqual({ a: 1, b: 2 })
  })

  it('应支持返回数组', () => {
    const arr: number[] = run(() => [1, 2, 3])
    expect(arr).toEqual([1, 2, 3])
  })

  it('应支持返回 undefined', () => {
    const result: undefined = run(() => undefined)
    expect(result).toBeUndefined()
  })

  it('应支持返回 null', () => {
    const result: null = run(() => null)
    expect(result).toBeNull()
  })

  it('应支持无参数函数', () => {
    const result: string = run(() => 'no args')
    expect(result).toBe('no args')
  })

  it('应支持嵌套对象类型', () => {
    type Nested = { user: { id: number; info: { name: string } } }
    const nested: Nested = run<Nested>(() => ({
      user: { id: 1, info: { name: 'Bob' } },
    }))
    expect(nested).toEqual({ user: { id: 1, info: { name: 'Bob' } } })
  })

  it('应支持函数返回函数', () => {
    const fn = run(() => () => 123)
    expect(fn()).toBe(123)
    type FnType = () => string
    const typedFn: FnType = run<FnType>(() => () => 'abc')
    expect(typedFn()).toBe('abc')
  })

  it('应支持空数组和空对象', () => {
    const arr: number[] = run(() => [])
    expect(arr).toEqual([])
    const obj: Record<string, unknown> = run(() => ({}))
    expect(obj).toEqual({})
  })

  it('应抛出异常时能捕获', () => {
    const errorFn = () => {
      throw new Error('test error')
    }
    expect(() => run(errorFn)).toThrow('test error')
  })

  it('泛型未指定时类型推断为 unknown', () => {
    // TypeScript会自动推断类型，但此处显式断言 unknown
    const result = run(() => ({ foo: 'bar' }))
    // result 类型应为 { foo: string }
    expect(result).toEqual({ foo: 'bar' })
    // 类型安全校验
    type TestType = typeof result
    const check: TestType = { foo: 'bar' }
    expect(check).toEqual(result)
  })
})
