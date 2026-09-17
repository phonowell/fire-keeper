import { describe, expect, it } from 'vitest'

import run from '../src/run.js'

describe('run', () => {
  it('应立即执行函数并返回结果', () => {
    expect(run(() => 42)).toBe(42)
    expect(run(() => ({ a: 1 }))).toEqual({ a: 1 })
    expect(run(() => 'x')).toBe('x')
  })

  it('异常应向上传递', () => {
    expect(() =>
      run(() => {
        throw new Error('boom')
      }),
    ).toThrow('boom')
  })
})
