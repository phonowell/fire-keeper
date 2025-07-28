import { describe, expect, it } from 'vitest'

import findIndex from '../src/findIndex.js'

describe('findIndex', () => {
  it('基本功能：返回第一个匹配项索引，未命中返回-1', () => {
    expect(findIndex([1, 2, 3, 4], (x) => x > 2)).toBe(2)
    expect(findIndex([1, 2, 3, 4], (x) => x === 1)).toBe(0)
    expect(findIndex([5], (x) => x === 5)).toBe(0)
    expect(findIndex([5], (x) => x === 1)).toBe(-1)
    expect(findIndex([1, 2, 3], (x) => x > 5)).toBe(-1)
    expect(findIndex([], () => true)).toBe(-1)
    expect(
      findIndex([undefined, null], (x) => typeof x === 'number' && x === 1),
    ).toBe(-1)
  })

  it('对象数组与类型守卫', () => {
    type User = { id: number }
    const users: User[] = [{ id: 1 }, { id: 2 }, { id: 3 }]
    expect(findIndex(users, (u) => u.id === 2)).toBe(1)
    expect(findIndex(users, (u) => u.id === 4)).toBe(-1)

    type Item = { type: string }
    const items: Item[] = [{ type: 'a' }, { type: 'test' }]
    const idx = findIndex(items, (x): x is Item => x.type === 'test')
    expect(idx).toBe(1)
  })

  it('应传递正确的索引和数组参数', () => {
    const arr = [10, 20, 30]
    let called = false
    findIndex(arr, (_v, i, a) => {
      called = true
      expect(a).toEqual(arr)
      expect(typeof i).toBe('number')
      return false
    })
    expect(called).toBe(true)
  })

  it('稀疏数组与全部匹配/不匹配', () => {
    const arr = [1, , 3]
    expect(findIndex(arr, (x) => x === undefined)).toBe(1)
    expect(findIndex(arr, (x) => x === 3)).toBe(2)
    expect(findIndex([1, 1, 1], (x) => x === 1)).toBe(0)
    expect(findIndex([2, 2, 2], (x) => x === 1)).toBe(-1)
  })

  it('复杂类型、NaN、Infinity、超大数组', () => {
    type Complex = { a: number; b?: { c: string } }
    const arr: Complex[] = [
      { a: 1 },
      { a: 2, b: { c: 'x' } },
      { a: 3, b: { c: 'y' } },
    ]
    expect(findIndex(arr, (x) => x.b?.c === 'y')).toBe(2)
    expect(findIndex(arr, (x) => x.b?.c === 'z')).toBe(-1)

    const nums = [NaN, Infinity, -Infinity, 0]
    expect(findIndex(nums, (x) => Number.isNaN(x))).toBe(0)
    expect(findIndex(nums, (x) => x === Infinity)).toBe(1)
    expect(findIndex(nums, (x) => x === -Infinity)).toBe(2)

    const bigArr = Array.from({ length: 10000 }, (_, i) => i)
    expect(findIndex(bigArr, (x) => x === 9999)).toBe(9999)
  })

  it('Symbol、BigInt、布尔、字符串、嵌套数组、函数、元组', () => {
    const s1 = Symbol('a')
    const s2 = Symbol('b')
    expect(findIndex([s1, s2], (x) => x === s2)).toBe(1)
    expect(findIndex([s1, s2], (x) => typeof x === 'symbol')).toBe(0)

    const bigs = [BigInt(1), BigInt(2), BigInt(3)]
    expect(findIndex(bigs, (x) => x === BigInt(2))).toBe(1)
    expect(findIndex(bigs, (x) => typeof x === 'bigint')).toBe(0)

    expect(findIndex([true, false], (x) => x === false)).toBe(1)
    expect(findIndex(['a', 'b', 'c'], (x) => x === 'b')).toBe(1)

    const arr = [[1], [2, 3], [4]]
    expect(findIndex(arr, (x) => Array.isArray(x) && x.includes(3))).toBe(1)

    const fn1 = () => 1
    const fn2 = () => 2
    expect(findIndex([fn1, fn2], (x) => x === fn2)).toBe(1)
    expect(findIndex([fn1, fn2], (x) => typeof x === 'function')).toBe(0)

    const tuple: [number, string, boolean] = [1, 'a', true]
    expect(findIndex(tuple, (x) => typeof x === 'string')).toBe(1)
    expect(findIndex(tuple, (x) => typeof x === 'boolean')).toBe(2)
  })

  it('泛型推断', () => {
    const testGeneric = <T>(arr: T[], pred: (v: T) => boolean) =>
      findIndex(arr, pred)
    expect(testGeneric<number>([1, 2, 3], (x) => x === 3)).toBe(2)
    expect(testGeneric<string>(['a', 'b'], (x) => x === 'b')).toBe(1)
  })

  it('谓词抛出异常应正确传递', () => {
    expect(() =>
      findIndex([1, 2, 3], () => {
        throw new Error('test')
      }),
    ).toThrow('test')
  })
})
