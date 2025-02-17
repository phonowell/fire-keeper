import path from 'path'

import { $, temp } from './index'

const originalCwd = process.cwd()

const a = () => {
  if (typeof $.root !== 'function') throw new Error('root is not a function')
}
a.description = 'root exists'

const b = async () => {
  const root = $.root()
  // Test basic path formatting
  if (root.includes('\\')) throw new Error('path contains backslashes')
  if (!path.isAbsolute(root)) throw new Error('path is not absolute')
  // Test current path exists
  if (!(await $.isExist(root))) throw new Error('returned path does not exist')
}
b.description = 'returns valid absolute path that exists'

const c = () => {
  // Special case for root directory
  const originalProcess = process.cwd
  process.cwd = () => '/'
  try {
    const root = $.root()
    if (root !== '/') throw new Error('root path not handled correctly')
  } finally {
    process.cwd = originalProcess
  }
}
c.description = 'handles root path correctly'

const d = async () => {
  // Test with various valid path components
  const testDir = `${temp}/root-test 特殊目录/a/b/c`
  await $.mkdir(testDir)

  try {
    process.chdir(testDir)
    const root = $.root()
    if (!root.endsWith('/root-test 特殊目录/a/b/c'))
      throw new Error('complex path not handled correctly')
  } finally {
    process.chdir(originalCwd)
    await $.remove(`${temp}/root-test 特殊目录`)
  }
}
d.description = 'handles complex paths with spaces and unicode'

const e = () => {
  // Test error cases
  const originalProcess = process.cwd

  // Test empty path
  process.cwd = () => ''
  try {
    $.root()
    throw new Error('should throw on empty path')
  } catch (error: unknown) {
    if (
      !(error instanceof Error) ||
      error.message !== 'Invalid path: path is empty'
    ) {
      throw error
    }
  }

  // Test forbidden characters
  process.cwd = () => '/test/invalid:char'
  try {
    $.root()
    throw new Error('should throw on forbidden characters')
  } catch (error: unknown) {
    if (
      !(error instanceof Error) ||
      error.message !== 'Invalid path: contains forbidden characters'
    ) {
      throw error
    }
  }

  // Test relative paths
  process.cwd = () => '/test/../something'
  try {
    $.root()
    throw new Error('should throw on relative path components')
  } catch (error: unknown) {
    if (
      !(error instanceof Error) ||
      error.message !== 'Invalid path: contains relative path components'
    ) {
      throw error
    }
  }

  process.cwd = originalProcess
}
e.description = 'throws appropriate errors for invalid paths'

// Cleanup function to ensure we're back in the original directory
const cleanup = () => {
  process.chdir(originalCwd)
}

export { a, b, c, d, e, cleanup }
