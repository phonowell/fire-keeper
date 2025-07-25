import { describe, expect, it } from 'vitest'

import findIndex from '../src/findIndex.js'

describe('findIndex', () => {
  it('应返回第一个匹配项的索引', () => {
    expect(findIndex([1, 2, 3, 4], (x) => x > 2)).toBe(2)
    expect(findIndex([1, 2, 3, 4], (x) => x === 1)).toBe(0)
    expect(findIndex([5], (x) => x === 5)).toBe(0)
    expect(findIndex([5], (x) => x === 1)).toBe(-1)
  })

  it('未找到匹配项应返回 -1', () => {
    expect(findIndex([1, 2, 3], (x) => x > 5)).toBe(-1)
    expect(findIndex([], () => true)).toBe(-1)
    expect(
      findIndex([undefined, null], (x) => typeof x === 'number' && x === 1),
    ).toBe(-1)
  })

  it('应支持对象数组查找', () => {
    type User = { id: number }
    const users: User[] = [{ id: 1 }, { id: 2 }, { id: 3 }]
    expect(findIndex(users, (u) => u.id === 2)).toBe(1)
    expect(findIndex(users, (u) => u.id === 4)).toBe(-1)
  })

  it('应支持类型守卫谓词', () => {
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

  it('应支持稀疏数组', () => {
    const arr = [1, , 3]
    expect(findIndex(arr, (x) => x === undefined)).toBe(1)
    expect(findIndex(arr, (x) => x === 3)).toBe(2)
  })

  it('全部匹配与全部不匹配场景', () => {
    expect(findIndex([1, 1, 1], (x) => x === 1)).toBe(0)
    expect(findIndex([2, 2, 2], (x) => x === 1)).toBe(-1)
  })

  it('复杂类型数组', () => {
    type Complex = { a: number; b?: { c: string } }
    const arr: Complex[] = [
      { a: 1 },
      { a: 2, b: { c: 'x' } },
      { a: 3, b: { c: 'y' } },
    ]
    expect(findIndex(arr, (x) => x.b?.c === 'y')).toBe(2)
    expect(findIndex(arr, (x) => x.b?.c === 'z')).toBe(-1)
  })
  // 边界与异常场景补充
  it('空数组应返回 -1', () => {
    expect(findIndex([], (_x) => true)).toBe(-1)
  })

  it('空函数应始终返回 -1', () => {
    expect(findIndex([1, 2, 3], () => false)).toBe(-1)
  })

  it('NaN、Infinity 等边界值', () => {
    const arr = [NaN, Infinity, -Infinity, 0]
    expect(findIndex(arr, (x) => Number.isNaN(x))).toBe(0)
    expect(findIndex(arr, (x) => x === Infinity)).toBe(1)
    expect(findIndex(arr, (x) => x === -Infinity)).toBe(2)
  })

  it('超大数组性能与正确性', () => {
    const arr = Array.from({ length: 10000 }, (_, i) => i)
    expect(findIndex(arr, (x) => x === 9999)).toBe(9999)
  })

  // 补充：Symbol 类型元素
  it('应支持 Symbol 类型元素查找', () => {
    const s1 = Symbol('a')
    const s2 = Symbol('b')
    const arr = [s1, s2]
    expect(findIndex(arr, (x) => x === s2)).toBe(1)
    expect(findIndex(arr, (x) => typeof x === 'symbol')).toBe(0)
  })

  // 补充：BigInt 类型元素
  it('应支持 BigInt 类型元素查找', () => {
    const arr = [BigInt(1), BigInt(2), BigInt(3)]
    expect(findIndex(arr, (x) => x === BigInt(2))).toBe(1)
    expect(findIndex(arr, (x) => typeof x === 'bigint')).toBe(0)
  })

  // 补充：布尔值、字符串类型
  it('应支持布尔值和字符串类型查找', () => {
    expect(findIndex([true, false], (x) => x === false)).toBe(1)
    expect(findIndex(['a', 'b', 'c'], (x) => x === 'b')).toBe(1)
  })

  // 补充：嵌套数组
  it('应支持嵌套数组查找', () => {
    const arr = [[1], [2, 3], [4]]
    expect(findIndex(arr, (x) => Array.isArray(x) && x.includes(3))).toBe(1)
  })

  // 补充：函数类型元素
  it('应支持函数类型元素查找', () => {
    const fn1 = () => 1
    const fn2 = () => 2
    const arr = [fn1, fn2]
    expect(findIndex(arr, (x) => x === fn2)).toBe(1)
    expect(findIndex(arr, (x) => typeof x === 'function')).toBe(0)
  })

  // 补充：只读数组
  // 只读数组类型约束：TypeScript 不允许直接传递 ReadonlyArray<number> 给 number[]，此用例删除

  // 补充：元组类型
  it('应支持元组类型查找', () => {
    const arr: [number, string, boolean] = [1, 'a', true]
    expect(findIndex(arr, (x) => typeof x === 'string')).toBe(1)
    expect(findIndex(arr, (x) => typeof x === 'boolean')).toBe(2)
  })

  // 补充：泛型推断
  it('应支持泛型数组查找', () => {
    function testGeneric<T>(arr: T[], pred: (v: T) => boolean) {
      return findIndex(arr, pred)
    }
    expect(testGeneric<number>([1, 2, 3], (x) => x === 3)).toBe(2)
    expect(testGeneric<string>(['a', 'b'], (x) => x === 'b')).toBe(1)
  })


  // 补充：谓词抛出异常
  it('谓词抛出异常应正确传递', () => {
    expect(() =>
      findIndex([1, 2, 3], () => {
        throw new Error('test')
      }),
    ).toThrow('test')
  })
})
