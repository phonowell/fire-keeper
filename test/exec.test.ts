import { describe, expect, it } from 'vitest'

import exec from '../src/exec.js'

describe('exec', () => {
  it('应正常执行单条命令并返回结果', async () => {
    const result = await exec('echo hello')
    expect(result[0]).toBe(0)
    expect(result[1]).toContain('hello')
    expect(result[2].join('')).toContain('hello')
  })

  it('应支持数组命令并正确拼接', async () => {
    const result = await exec(['echo foo', 'echo bar'])
    expect(result[0]).toBe(0)
    expect(result[2].some((msg) => msg.includes('foo'))).toBeTruthy()
    expect(result[2].some((msg) => msg.includes('bar'))).toBeTruthy()
  })

  it('应处理 options 参数为 undefined', async () => {
    const result = await exec('echo opt', undefined)
    expect(result[0]).toBe(0)
    expect(result[1]).toContain('opt')
  })

  it('应支持并发执行', async () => {
    const [r1, r2] = await Promise.all([
      exec('echo concurrent1'),
      exec('echo concurrent2'),
    ])
    expect(r1[1]).toContain('concurrent1')
    expect(r2[1]).toContain('concurrent2')
  })

  it('应处理大量输出', async () => {
    const repeat = Array(100).fill('echo line').join('; ')
    const result = await exec(repeat)
    expect(result[0]).toBe(0)
    expect(result[2].length).toBeGreaterThanOrEqual(1)
  })
})
