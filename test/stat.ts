import os from '../src/os'
import echo from '../src/echo'

import { $, temp } from './index'

const a = async () => {
  // Test basic file stats
  await $.copy('./package.json', temp)
  const stat = await $.stat('./package.json')
  if (!stat) throw new Error('stats should exist')
  if (!stat.isFile()) throw new Error('should be a file')
  if (typeof stat.size !== 'number') throw new Error('invalid size')
}
a.description = 'returns stats for existing file'

const b = async () => {
  // Test non-existent file
  let echoMessage = ''
  const originalEcho = echo
  // @ts-ignore: Replacing echo function temporarily
  echo = (prefix: string, message: string) => {
    echoMessage = message
  }

  try {
    const stat = await $.stat(`${temp}/non-existent.txt`)
    if (stat) throw new Error('should return null for non-existent file')
    if (!echoMessage.includes('not found')) {
      throw new Error('should log not found message')
    }
  } finally {
    // @ts-ignore: Restoring original echo
    echo = originalEcho
  }
}
b.description = 'returns null and logs message for non-existent files'

const c = async () => {
  // Test directory and glob pattern
  const dirPath = `${temp}/stat-test-dir`
  await $.mkdir(dirPath)
  await $.write(`${dirPath}/test.txt`, 'test')

  try {
    // Test directory stats
    const dirStat = await $.stat(dirPath)
    if (!dirStat?.isDirectory()) throw new Error('should be a directory')

    // Test glob pattern
    const fileStat = await $.stat(`${dirPath}/*.txt`)
    if (!fileStat?.isFile())
      throw new Error('should find file with glob pattern')
  } finally {
    await $.remove(dirPath)
  }
}
c.description = 'handles directories and glob patterns'

const d = async () => {
  // Test symlink (skip on Windows)
  if (os() === 'windows') return

  const target = `${temp}/link-target.txt`
  const link = `${temp}/test-link`

  await $.write(target, 'test')
  await $.link(target, link)

  try {
    const stat = await $.stat(link)
    if (!stat) throw new Error('link stats should exist')
    // Check it resolves the symlink
    if (!stat.isFile()) throw new Error('should resolve to target file')
  } finally {
    await $.remove(target)
    await $.remove(link)
  }
}
d.description = 'resolves symbolic links to target stats'

const e = async () => {
  // Test error handling
  try {
    // @ts-ignore: Intentionally passing null to trigger fs.stat error
    await $.stat(null)
    throw new Error('should throw error when stat fails')
  } catch (err) {
    if (!(err instanceof Error)) {
      throw new Error('error should be instance of Error')
    }
  }
}
e.description = 'throws error on fs.stat failure'

export { a, b, c, d, e }
