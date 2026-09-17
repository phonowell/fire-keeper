import { afterEach, describe, expect, it } from 'vitest'

import argv from '../src/argv.js'

describe('argv', () => {
  const originalArgv = process.argv

  afterEach(() => {
    process.argv = originalArgv
  })

  it('应解析进程参数为对象', async () => {
    const result = await argv()
    expect(Array.isArray(result._)).toBe(true)
    expect(typeof result.$0).toBe('string')
  })

  it('应解析长选项与位置参数', async () => {
    process.argv = ['node', 'task', 'src', 'dist', '--name', 'dev', '--verbose']
    const result = await argv()
    expect(result.name).toBe('dev')
    expect(result.verbose).toBe(true)
    expect(result._).toEqual(['src', 'dist'])
  })

  it('应解析 --key=value 形式与数字', async () => {
    process.argv = ['node', 'task', '--port=8080', '--tag=beta']
    const result = await argv()
    expect(result.port).toBe(8080)
    expect(result.tag).toBe('beta')
  })

  it('应解析短选项与布尔否定', async () => {
    process.argv = ['node', 'task', '-x', '--no-cache']
    const result = await argv()
    expect(result.x).toBe(true)
    expect(result.cache).toBe(false)
  })

  it('应将 -- 分隔符后的参数原样收入位置参数', async () => {
    process.argv = ['node', 'task', 'a', '--', '--not-a-flag']
    const result = await argv()
    expect(result._).toEqual(['a', '--not-a-flag'])
  })
})
