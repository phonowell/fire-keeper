import prompts from 'prompts'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import echo from '../src/echo.js'
import prompt from '../src/prompt.js'
import read from '../src/read.js'
import remove from '../src/remove.js'

describe('prompt', () => {
  const CACHE_FILE = './temp/cache-prompt.json'

  beforeEach(() => {
    echo.isFrozen = false
    echo.isSilent = false
  })

  afterEach(async () => {
    await remove(CACHE_FILE).catch(() => {})
    echo.isFrozen = false
    echo.isSilent = false
  })

  it('text 应返回输入值', async () => {
    prompts.inject(['hello'])
    expect(await prompt({ type: 'text', message: 'name' })).toBe('hello')
  })

  it('text 空提交应返回默认值', async () => {
    prompts.inject([undefined])
    expect(await prompt({ type: 'text', default: 'dft' })).toBe('dft')
  })

  it('select 应返回选中值', async () => {
    prompts.inject(['prod'])
    expect(await prompt({ type: 'select', list: ['dev', 'prod'] })).toBe('prod')
  })

  it('select 应支持对象选项', async () => {
    prompts.inject([2])
    const value = await prompt({
      type: 'select',
      list: [
        { title: '开发', value: 1 },
        { title: '生产', value: 2 },
      ],
    })
    expect(value).toBe(2)
  })

  it('select 空提交应返回初始索引', async () => {
    prompts.inject([undefined])
    expect(await prompt({ type: 'select', list: ['a', 'b', 'c'], default: 1 })).toBe(1)
  })

  it('select 负数默认值应从末尾取', async () => {
    prompts.inject([undefined])
    expect(await prompt({ type: 'select', list: ['a', 'b', 'c'], default: -1 })).toBe(2)
  })

  it('select 默认值可按值匹配', async () => {
    prompts.inject([undefined])
    expect(await prompt({ type: 'select', list: ['a', 'b', 'c'], default: 'b' })).toBe(1)
  })

  it('select 越界默认值应收敛到末项', async () => {
    prompts.inject([undefined])
    expect(await prompt({ type: 'select', list: ['a', 'b', 'c'], default: 99 })).toBe(2)
  })

  it('number 应返回数字，空提交回落到 min', async () => {
    prompts.inject([7])
    expect(await prompt({ type: 'number', min: 0, max: 10 })).toBe(7)

    prompts.inject([undefined])
    expect(await prompt({ type: 'number', min: 3, max: 10 })).toBe(3)
  })

  it('confirm 与 toggle 应返回布尔值', async () => {
    prompts.inject([true])
    expect(await prompt({ type: 'confirm' })).toBe(true)

    prompts.inject([false])
    expect(await prompt({ type: 'toggle' })).toBe(false)
  })

  it('multi 应返回数组', async () => {
    prompts.inject([['x', 'y']])
    expect(await prompt({ type: 'multi', list: ['x', 'y', 'z'] })).toEqual(['x', 'y'])
  })

  it('auto 应映射为 autocomplete', async () => {
    prompts.inject(['b'])
    expect(await prompt({ type: 'auto', list: ['a', 'b'] })).toBe('b')
  })

  it('带 id 时应写入缓存并在下次作为默认值', async () => {
    prompts.inject(['cached-value'])
    expect(await prompt({ type: 'text', id: 'ck1' })).toBe('cached-value')

    const cache = await read<Record<string, { type: string; value: unknown }>>(CACHE_FILE)
    expect(cache?.ck1).toEqual({ type: 'text', value: 'cached-value' })

    prompts.inject([undefined])
    expect(await prompt({ type: 'text', id: 'ck1' })).toBe('cached-value')
  })

  it('multi 类型不应写缓存', async () => {
    prompts.inject([['x']])
    await prompt({ type: 'multi', id: 'mk1', list: ['x'] })

    const cache = await read<Record<string, unknown>>(CACHE_FILE)
    expect(cache?.mk1).toBeUndefined()
  })

  it('缓存类型不匹配时不应作为默认值', async () => {
    // 存入 text 类型的 'b'；若被误用，select 默认值会指向索引 1
    prompts.inject(['b'])
    await prompt({ type: 'text', id: 'mix' })

    prompts.inject([undefined])
    expect(await prompt({ type: 'select', id: 'mix', list: ['a', 'b'] })).toBe(0)
  })

  it('格式化失败后应恢复 echo 状态', async () => {
    const brokenPrompt = prompt as unknown as (input: { type: string }) => Promise<unknown>
    await expect(brokenPrompt({ type: 'invalid' })).rejects.toThrow("invalid type 'invalid'")
    expect(echo.isSilent).toBe(false)
  })

  it('格式化失败后应保留原始静默状态', async () => {
    echo.isSilent = true
    const brokenPrompt = prompt as unknown as (input: { type: string }) => Promise<unknown>
    await expect(brokenPrompt({ type: 'invalid' })).rejects.toThrow()
    expect(echo.isSilent).toBe(true)
  })
})
