import fs from 'fs'

import { describe, expect, it } from 'vitest'

import exec from '../src/exec.js'

const TEMP_DIR = './temp/exec'

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

  it('数组命令遇到失败时应停止后续命令并返回失败码', async () => {
    const result = await exec(
      [
        `node -e "console.log('before')"`,
        `node -e "process.exit(3)"`,
        `node -e "console.log('after')"`,
      ],
      { echo: false, silent: true },
    )

    expect(result[0]).toBe(3)
    expect(result[2].some((msg) => msg.includes('before'))).toBe(true)
    expect(result[2].some((msg) => msg.includes('after'))).toBe(false)
  })

  it('数组命令应保留同一 shell 上下文', async () => {
    fs.mkdirSync(TEMP_DIR, { recursive: true })

    try {
      const result = await exec(
        ['cd ./temp/exec', `node -e "console.log(process.cwd())"`],
        { echo: false, silent: true },
      )

      expect(result[0]).toBe(0)
      expect(result[1].replace(/\\/g, '/')).toMatch(/\/temp\/exec$/)
    } finally {
      fs.rmSync(TEMP_DIR, { force: true, recursive: true })
    }
  })
})
