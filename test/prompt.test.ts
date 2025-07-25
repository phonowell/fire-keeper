import prompts from 'prompts'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import echo from '../src/echo.js'
import prompt from '../src/prompt.js'
import read from '../src/read.js'
import write from '../src/write.js'

// Mock dependencies
vi.mock('prompts')
vi.mock('../src/echo.js')
vi.mock('../src/read.js')
vi.mock('../src/write.js')

describe('prompt', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(echo.pause).mockImplementation(() => undefined)
    vi.mocked(echo.resume).mockImplementation(() => undefined)
    vi.mocked(read).mockResolvedValue(null)
    vi.mocked(write).mockResolvedValue(undefined)
  })

  it('应支持 text 类型输入', async () => {
    vi.mocked(prompts).mockResolvedValue({ value: 'hello' })

    const result = await prompt({ type: 'text', message: '请输入文本' })

    expect(result).toBe('hello')
    expect(prompts).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'text',
        message: '请输入文本',
        name: 'value',
        initial: '',
      })
    )
  })

  it('应支持 number 类型输入', async () => {
    vi.mocked(prompts).mockResolvedValue({ value: 42 })

    const result = await prompt({
      type: 'number',
      message: '请输入数字',
      min: 0,
      max: 100,
    })

    expect(result).toBe(42)
    expect(prompts).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'number',
        message: '请输入数字',
        min: 0,
        max: 100,
      })
    )
  })

  it('应支持 select 类型选择', async () => {
    vi.mocked(prompts).mockResolvedValue({ value: 'option2' })

    const result = await prompt({
      type: 'select',
      message: '请选择',
      list: ['option1', 'option2', 'option3'],
    })

    expect(result).toBe('option2')
    expect(prompts).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'select',
        message: '请选择',
        choices: expect.arrayContaining([
          expect.objectContaining({ title: 'option1', value: 'option1' }),
          expect.objectContaining({ title: 'option2', value: 'option2' }),
          expect.objectContaining({ title: 'option3', value: 'option3' }),
        ]),
      })
    )
  })

  it('应支持 multi 类型多选', async () => {
    vi.mocked(prompts).mockResolvedValue({ value: ['a', 'c'] })

    const result = await prompt({
      type: 'multi',
      message: '多选',
      list: ['a', 'b', 'c'],
    })

    expect(result).toEqual(['a', 'c'])
    expect(prompts).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'multiselect',
        message: '多选',
      })
    )
  })

  it('应支持 confirm 类型确认', async () => {
    vi.mocked(prompts).mockResolvedValue({ value: true })

    const result = await prompt({ type: 'confirm', message: '确认吗？' })

    expect(result).toBe(true)
    expect(prompts).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'confirm',
        message: '确认吗？',
        initial: false,
      })
    )
  })

  it('应支持 toggle 类型切换', async () => {
    vi.mocked(prompts).mockResolvedValue({ value: true })

    const result = await prompt({
      type: 'toggle',
      message: '开关',
      on: '开',
      off: '关',
    })

    expect(result).toBe(true)
    expect(prompts).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'toggle',
        message: '开关',
        active: '开',
        inactive: '关',
      })
    )
  })

  it('应支持 auto 类型自动完成', async () => {
    vi.mocked(prompts).mockResolvedValue({ value: 'auto' })

    const result = await prompt({
      type: 'auto',
      message: '自动选择',
      list: ['auto', 'manual'],
    })

    expect(result).toBe('auto')
    expect(prompts).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'autocomplete',
        message: '自动选择',
      })
    )
  })

  it('应支持默认值', async () => {
    vi.mocked(prompts).mockResolvedValue({ value: 'default text' })

    const result = await prompt({
      type: 'text',
      message: '输入',
      default: 'default text',
    })

    expect(result).toBe('default text')
    expect(prompts).toHaveBeenCalledWith(
      expect.objectContaining({
        initial: 'default text',
      })
    )
  })

  it('应正确管理 echo 状态', async () => {
    vi.mocked(prompts).mockResolvedValue({ value: 'test' })

    await prompt({ type: 'text', message: '测试' })

    expect(echo.pause).toHaveBeenCalled()
    expect(echo.resume).toHaveBeenCalled()
  })

  it('应调用缓存读写功能', async () => {
    vi.mocked(prompts).mockResolvedValue({ value: 'cached' })

    await prompt({ type: 'text', id: 'test-id', message: '测试' })

    expect(read).toHaveBeenCalled()
    expect(write).toHaveBeenCalled()
  })
})
