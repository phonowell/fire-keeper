import fs from 'fs'
import path from 'path'

import { describe, expect, it } from 'vitest'

import exec from '../src/exec.js'

const TEMP_DIR = 'temp'

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

  it('应返回正确的退出码', async () => {
    const result = await exec('exit 5')
    expect(result[0]).toBe(5)
  })

  it('应处理不存在命令并返回非零退出码', async () => {
    const result = await exec('nonexistent_command')
    expect(result[0]).not.toBe(0)
    expect(result[2].length).toBeGreaterThan(0)
  })

  it('应正确处理多行及特殊字符输出', async () => {
    const result = await exec('echo "line1 line2 特殊字符"')
    expect(result[1]).toContain('line1')
    expect(result[1]).toContain('特殊字符')
  })

  it('应处理超长命令', async () => {
    const longStr = `echo ${'x'.repeat(100)}`
    const result = await exec(longStr)
    expect(result[0]).toBe(0)
    expect(result[1].length).toBeGreaterThan(50)
  })

  it('应处理 options 参数为 undefined', async () => {
    const result = await exec('echo opt', undefined)
    expect(result[0]).toBe(0)
    expect(result[1]).toContain('opt')
  })

  it('应处理特殊字符命令', async () => {
    const result = await exec('echo "特殊;字符"')
    expect(result[1]).toContain('特殊;字符')
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

  it('应能创建并删除临时文件', async () => {
    if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true })

    const filePath = path.join(TEMP_DIR, 'exec_temp.txt')
    const writeCmd = `echo temp > "${filePath}"`
    await exec(writeCmd)
    expect(fs.existsSync(filePath)).toBeTruthy()
    fs.unlinkSync(filePath)
    // 彻底清理临时目录
    if (fs.existsSync(TEMP_DIR))
      fs.rmSync(TEMP_DIR, { recursive: true, force: true })

    expect(fs.existsSync(filePath)).toBeFalsy()
    expect(fs.existsSync(TEMP_DIR)).toBeFalsy()
  })
})
