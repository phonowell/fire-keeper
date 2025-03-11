/**
 * 测试用例说明：
 * a - 创建嵌套目录：验证可以递归创建多层目录结构，并确保父目录都被正确创建
 * b - 创建多个目录：验证可以同时创建多个独立的目录
 * c - 处理特殊字符：验证可以创建包含特殊字符（如中文、空格、符号）的目录
 * d - 在已存在目录中创建：验证可以在已存在的目录中创建新的嵌套目录
 * e - 处理空输入：验证当输入为空字符串或空数组时的行为
 * f - 处理路径规范化：验证对包含 . 和 .. 的路径进行正确规范化
 * g - 设置合理权限：验证创建的目录具有适当的访问权限（非Windows系统）
 * h - 处理并发创建：验证可以同时创建多个嵌套目录
 * i - 处理深层嵌套：验证可以创建深层嵌套的目录结构
 * j - 处理无效路径：验证对无效路径字符的错误处理（Windows系统）
 * k - 处理空路径数组：验证当数组中所有路径都无效时的行为
 * l - 处理不同输入类型：验证同时支持字符串和数组两种输入方式
 */

import path from 'path'

import { isExist, mkdir, os } from '../src'

import { TEMP } from './index'

const a = async () => {
  const source = `${TEMP}/m/k/d/i/r`
  await mkdir(source)

  if (!(await isExist(source))) throw new Error('directory not created')

  // Verify all parent directories
  const parts = source.split('/')
  for (let i = 1; i < parts.length; i++) {
    const parentPath = parts.slice(0, i + 1).join('/')
    if (!(await isExist(parentPath)))
      throw new Error(`parent directory ${parentPath} not created`)
  }
}
a.description = 'creates nested directories'

const b = async () => {
  const sources = [`${TEMP}/a`, `${TEMP}/b`, `${TEMP}/c`]
  await mkdir(sources)

  for (const source of sources) {
    if (!(await isExist(source)))
      throw new Error(`directory ${source} not created`)
  }
}
b.description = 'creates multiple directories'

const c = async () => {
  // Test with special characters
  const sources = [
    `${TEMP}/special!@#$`,
    `${TEMP}/unicode文件夹`,
    `${TEMP}/space dir`,
    `${TEMP}/deeply/nested/path/with/special/大文件夹/!@#$`,
  ]

  await mkdir(sources)

  for (const source of sources) {
    if (!(await isExist(source)))
      throw new Error(`special character directory ${source} not created`)
  }
}
c.description = 'handles special characters'

const d = async () => {
  // Test creating in existing directory
  const source = `${TEMP}/existing/nested`
  await mkdir(`${TEMP}/existing`)
  await mkdir(source)

  if (!(await isExist(source)))
    throw new Error('nested directory in existing path not created')
}
d.description = 'creates in existing directory'

const e = async () => {
  // Test empty input
  await mkdir('')
  await mkdir([])
}
e.description = 'handles empty input'

const f = async () => {
  // Test path normalization
  const source = `${TEMP}/./normalize/../normalize/test`
  const normalizedPath = `${TEMP}/normalize/test`
  await mkdir(source)

  if (!(await isExist(normalizedPath)))
    throw new Error('normalized path not created')
}
f.description = 'handles path normalization'

const g = async () => {
  if (os() === 'windows') return // Skip on Windows

  // Test directory permissions
  const source = `${TEMP}/permission-test`
  await mkdir(source)

  // Use native fs module to check permissions
  const fs = await import('fs/promises')
  const stats = await fs.stat(source)

  // Check that basic permissions exist (read/write/execute for owner)
  const ownerPermissions = stats.mode & 0o700 // owner bits
  if (ownerPermissions < 0o700)
    throw new Error('insufficient directory permissions')
}
g.description = 'sets reasonable permissions'

const h = async () => {
  // Test concurrent directory creation
  const base = `${TEMP}/concurrent`
  const sources = Array.from({ length: 10 }, (_, i) =>
    path.join(base, `dir${i}`, 'nested', 'path'),
  )

  await Promise.all(sources.map((source) => mkdir(source)))

  for (const source of sources) {
    if (!(await isExist(source)))
      throw new Error(`concurrent directory ${source} not created`)
  }
}
h.description = 'handles concurrent creation'

const i = async () => {
  // Test deeply nested paths (testing reasonable limits)
  const parts = Array.from({ length: 20 }, (_, i) => `deep${i}`)
  const source = path.join(TEMP, ...parts)

  await mkdir(source)

  if (!(await isExist(source)))
    throw new Error('deeply nested directory not created')
}
i.description = 'handles deep nesting'

const j = async () => {
  // Test error case: invalid characters in path
  if (os() === 'windows') {
    const source = `${TEMP}/invalid<>:"|?*`
    try {
      await mkdir(source)
      throw new Error('should throw for invalid Windows path')
    } catch (error) {
      if (!(error instanceof Error)) throw new Error('wrong error type')
    }
  }
}
j.description = 'handles invalid paths'

const k = async () => {
  // Test with empty paths that will be filtered out
  await mkdir(['', ' ', '  '])
}
k.description = 'handles empty paths'

const l = async () => {
  // Test single string vs array input
  const singlePath = `${TEMP}/single-string-test`
  const arrayPath = [`${TEMP}/array-test`]

  // Test both input types work
  await mkdir(singlePath)
  await mkdir(arrayPath)

  if (!(await isExist(singlePath)))
    throw new Error('single string path not created')

  if (!(await isExist(arrayPath[0]))) throw new Error('array path not created')
}
l.description = 'handles both string and array inputs'

export { a, b, c, d, e, f, g, h, i, j, k, l }
