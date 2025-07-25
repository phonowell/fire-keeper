import path from 'path'

import { isExist, mkdir, remove, root } from '../src/index.js'

import { TEMP } from './index.js'

const originalCwd = process.cwd()

const a = () => {
  if (typeof root !== 'function') throw new Error('root is not a function')
}
a.description = 'root exists'

const b = async () => {
  const rootString = root()

  if (rootString.includes('\\')) throw new Error('path contains backslashes')
  if (!path.isAbsolute(rootString)) throw new Error('path is not absolute')

  if (!(await isExist(rootString)))
    throw new Error('returned path does not exist')
}
b.description = 'returns valid absolute path that exists'

const c = () => {
  const originalProcess = process.cwd
  process.cwd = () => '/'
  try {
    const rootString = root()
    if (rootString !== '/') throw new Error('root path not handled correctly')
  } finally {
    process.cwd = originalProcess
  }
}
c.description = 'handles root path correctly'

const d = async () => {
  const testDir = `${TEMP}/root-test 特殊目录/a/b/c`
  await mkdir(testDir)

  try {
    process.chdir(testDir)
    const rootString = root()
    if (!rootString.endsWith('/root-test 特殊目录/a/b/c'))
      throw new Error('complex path not handled correctly')
  } finally {
    process.chdir(originalCwd)
    await remove(`${TEMP}/root-test 特殊目录`)
  }
}
d.description = 'handles complex paths with spaces and unicode'

const e = () => {
  const originalProcess = process.cwd

  process.cwd = () => ''
  try {
    root()
    throw new Error('should throw on empty path')
  } catch (error: unknown) {
    if (
      !(error instanceof Error) ||
      error.message !== 'Invalid path: path is empty'
    )
      throw error
  }

  process.cwd = () => '/test/invalid?char'
  try {
    root()
    throw new Error('should throw on forbidden characters')
  } catch (error: unknown) {
    if (
      !(error instanceof Error) ||
      error.message !== 'Invalid path: contains forbidden characters'
    )
      throw error
  }

  process.cwd = () => '/test/../something'
  try {
    root()
    throw new Error('should throw on relative path components')
  } catch (error: unknown) {
    if (
      !(error instanceof Error) ||
      error.message !== 'Invalid path: contains relative path components'
    )
      throw error
  }

  process.cwd = originalProcess
}
e.description = 'throws appropriate errors for invalid paths'

const cleanup = () => {
  process.chdir(originalCwd)
}

export { a, b, c, d, e, cleanup }
