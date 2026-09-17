import { describe, expect, it } from 'vitest'

import * as index from '../src/index.js'

describe('index', () => {
  it('应导出全部模块且均为函数', () => {
    const entries = Object.entries(index)
    expect(entries.length).toBeGreaterThanOrEqual(40)
    for (const [key, value] of entries) expect(typeof value, key).toBe('function')
  })
})
