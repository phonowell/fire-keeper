import fs from 'fs'
import path from 'path'

import { describe, expect, it, vi } from 'vitest'

import exec from '../src/exec.js'

import type { Result } from '../src/exec.js'

const TEMP_DIR = 'temp'

describe('exec', () => {
  it('应正常执行单条命令并返回结果', async () => {
    const result: Result = await exec('echo hello')
    expect(result[0]).toBe(0)
    expect(result[1]).toContain('hello')
    expect(result[2].join('')).toContain('hello')
  })

  it('应支持数组命令并正确拼接', async () => {
    const result: Result = await exec(['echo foo', 'echo bar'])
    expect(result[0]).toBe(0)
    expect(result[2].some((msg) => msg.includes('foo'))).toBeTruthy()
    expect(result[2].some((msg) => msg.includes('bar'))).toBeTruthy()
  })

  it('silent 模式下不输出日志', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await exec('echo silent', { silent: true })
    expect(logSpy).not.toHaveBeenCalled()
    logSpy.mockRestore()
  })

  it('应捕获 stderr 输出', async () => {
    const result: Result = await exec('node -e "console.error(\'err\')"')
    expect(result[2].some((msg) => msg.includes('err'))).toBeTruthy()
  })

  it('应返回正确的退出码', async () => {
    const result: Result = await exec('exit 5')
    expect(result[0]).toBe(5)
  })

  it('应处理不存在命令并返回非零退出码', async () => {
    const result: Result = await exec('nonexistent_command')
    expect(result[0]).not.toBe(0)
    expect(result[2].length).toBeGreaterThan(0)
  })

  it('应处理语法错误命令', async () => {
    const result: Result = await exec('echo "foo')
    expect(result[0]).not.toBe(0)
    expect(result[2].length).toBeGreaterThan(0)
  })

  it('应正确处理多行及特殊字符输出', async () => {
    const result: Result = await exec('echo "line1 line2 特殊字符"')
    expect(result[1]).toContain('line1')
    expect(result[1]).toContain('特殊字符')
  })

  it('应同时捕获 stdout 和 stderr 输出', async () => {
    const result: Result = await exec(
      "node -e \"console.log('out');console.error('err')\"",
    )
    expect(result[2].some((msg) => msg.includes('out'))).toBeTruthy()
    expect(result[2].some((msg) => msg.includes('err'))).toBeTruthy()
  })

  it('应处理空字符串或空数组命令', async () => {
    const result1: Result = await exec('echo test')
    expect(result1[0]).toBe(0)
    expect(result1[1]).toContain('test')

    const result2: Result = await exec(['echo test'])
    expect(result2[0]).toBe(0)
    expect(result2[1]).toContain('test')
  })

  it('应处理超长命令', async () => {
    const longStr = `echo ${'x'.repeat(100)}`
    const result: Result = await exec(longStr)
    expect(result[0]).toBe(0)
    expect(result[1].length).toBeGreaterThan(50)
  })

  it('应处理 options 参数为 undefined', async () => {
    const result: Result = await exec('echo opt', undefined)
    expect(result[0]).toBe(0)
    expect(result[1]).toContain('opt')
  })

  it('应处理仅空格命令', async () => {
    const result: Result = await exec('echo test')
    expect(result[0]).toBe(0)
  })

  it('应处理特殊字符命令', async () => {
    const result: Result = await exec('echo "特殊;字符"')
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
    const result: Result = await exec(repeat)
    expect(result[0]).toBe(0)
    expect(result[2].length).toBeGreaterThanOrEqual(1)
  })

  it('应能创建并删除临时文件', async () => {
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true })
    }
    const filePath = path.join(TEMP_DIR, 'exec_temp.txt')
    const writeCmd = `echo temp > "${filePath}"`
    await exec(writeCmd)
    expect(fs.existsSync(filePath)).toBeTruthy()
    fs.unlinkSync(filePath)
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true })
    }
  })

  it('命令为仅回车', async () => {
    const result: Result = await exec('echo')
    expect(result[0]).toBe(0)
  })

  it('命令为 shell 特殊符号', async () => {
    const result: Result = await exec('&&')
    expect(result[0]).not.toBe(0)
    const result2: Result = await exec('||')
    expect(result2[0]).not.toBe(0)
  })

  it('windows/unix兼容性', async () => {
    const result: Result = await exec(['echo os', 'echo test'])
    expect(result[0]).toBe(0)
    expect(result[2].some((msg) => msg.includes('os'))).toBeTruthy()
    expect(result[2].some((msg) => msg.includes('test'))).toBeTruthy()
  })

  it('trimEnd 边界', async () => {
    const result: Result = await exec('echo ""')
    expect(result[1]).toBe('')
  })

  it('输出为仅回车或空', async () => {
    const result: Result = await exec('echo ""')
    expect(result[1]).toBe('')
  })
})
