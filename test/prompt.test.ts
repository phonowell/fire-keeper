import { beforeEach, describe, expect, it } from 'vitest'

import echo from '../src/echo.js'
import prompt from '../src/prompt.js'

describe('prompt', () => {
  beforeEach(() => {
    echo.isFrozen = false
    echo.isSilent = false
  })

  it('格式化失败后应恢复 echo 状态', async () => {
    const brokenPrompt = prompt as unknown as (input: {
      type: string
    }) => Promise<unknown>
    await expect(brokenPrompt({ type: 'invalid' })).rejects.toThrow(
      "invalid type 'invalid'",
    )
    expect(echo.isSilent).toBe(false)
  })

  it('格式化失败后应保留原始静默状态', async () => {
    echo.isSilent = true
    const brokenPrompt = prompt as unknown as (input: {
      type: string
    }) => Promise<unknown>
    await expect(brokenPrompt({ type: 'invalid' })).rejects.toThrow()
    expect(echo.isSilent).toBe(true)
  })
})
