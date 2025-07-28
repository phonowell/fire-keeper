import fs from 'fs'
import path from 'path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import watch from '../src/watch.js'

const tempDir = path.join(__dirname, '../temp', 'watch')
const tempFile = path.join(tempDir, 'watch-test.txt')
const tempFile2 = path.join(tempDir, 'watch-test2.txt')

const ensureTempDir = function () {
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })
}
const cleanTempFiles = function () {
  if (fs.existsSync(tempDir))
    fs.rmSync(tempDir, { recursive: true, force: true })
}

describe('watch', () => {
  beforeEach(() => {
    ensureTempDir()
    cleanTempFiles()
  })
  afterEach(() => {
    cleanTempFiles()
  })

  it('监听单个文件变更并回调', async () => {
    ensureTempDir()
    fs.mkdirSync(path.dirname(tempFile), { recursive: true })
    fs.writeFileSync(tempFile, 'init')
    let called = ''
    const unwatch = watch(tempFile, (p) => {
      called = p
    })
    await new Promise((resolve) => setTimeout(resolve, 100))
    fs.appendFileSync(tempFile, 'change')
    // 等待回调发生或超时
    await new Promise((resolve, reject) => {
      const start = Date.now()
      const timer = setInterval(() => {
        if (called) {
          clearInterval(timer)
          resolve(null)
        } else if (Date.now() - start > 1500) {
          clearInterval(timer)
          reject(new Error('watch callback not triggered'))
        }
      }, 50)
    })
    unwatch()
    expect(called).toContain('watch-test.txt')
  })

  it('监听多个文件时变更第一个文件能回调', async () => {
    ensureTempDir()
    fs.mkdirSync(path.dirname(tempFile), { recursive: true })
    fs.mkdirSync(path.dirname(tempFile2), { recursive: true })
    fs.writeFileSync(tempFile, 'a')
    fs.writeFileSync(tempFile2, 'b')
    let called = ''
    const unwatch = watch([tempFile, tempFile2], (p) => {
      called = p
    })
    await new Promise((resolve) => setTimeout(resolve, 100))
    fs.appendFileSync(tempFile, '1')
    await new Promise((resolve, reject) => {
      const start = Date.now()
      const timer = setInterval(() => {
        if (called.includes('watch-test.txt')) {
          clearInterval(timer)
          resolve(null)
        } else if (Date.now() - start > 2000) {
          clearInterval(timer)
          reject(new Error('watch callback not triggered'))
        }
      }, 50)
    })
    unwatch()
    expect(called).toContain('watch-test.txt')
  })

  it('监听多个文件时变更第二个文件能回调', async () => {
    ensureTempDir()
    fs.mkdirSync(path.dirname(tempFile), { recursive: true })
    fs.mkdirSync(path.dirname(tempFile2), { recursive: true })
    fs.writeFileSync(tempFile, 'a')
    fs.writeFileSync(tempFile2, 'b')
    let called = ''
    const unwatch = watch([tempFile, tempFile2], (p) => {
      called = p
    })
    await new Promise((resolve) => setTimeout(resolve, 100))
    fs.appendFileSync(tempFile2, '2')
    await new Promise((resolve, reject) => {
      const start = Date.now()
      const timer = setInterval(() => {
        if (called.includes('watch-test2.txt')) {
          clearInterval(timer)
          resolve(null)
        } else if (Date.now() - start > 2000) {
          clearInterval(timer)
          reject(new Error('watch callback not triggered'))
        }
      }, 50)
    })
    unwatch()
    expect(called).toContain('watch-test2.txt')
  })

  it('支持 debounce 配置', async () => {
    ensureTempDir()
    fs.mkdirSync(path.dirname(tempFile), { recursive: true })
    fs.writeFileSync(tempFile, 'init')
    let count = 0
    const unwatch = watch(
      tempFile,
      () => {
        count++
      },
      { debounce: 200 },
    )
    await new Promise((resolve) => setTimeout(resolve, 100))
    fs.appendFileSync(tempFile, '1')
    fs.appendFileSync(tempFile, '2')
    await new Promise((resolve) => setTimeout(resolve, 500))
    unwatch()
    expect(count).toBe(1)
  })

  it('返回关闭函数可正常关闭 watcher', async () => {
    ensureTempDir()
    fs.mkdirSync(path.dirname(tempFile), { recursive: true })
    fs.writeFileSync(tempFile, 'init')
    let called = false
    const unwatch = watch(tempFile, () => {
      called = true
    })
    await new Promise((resolve) => setTimeout(resolve, 100))
    unwatch()
    fs.appendFileSync(tempFile, 'change')
    await new Promise((resolve) => setTimeout(resolve, 300))
    expect(called).toBe(false)
  })
})
