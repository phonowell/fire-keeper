import { copy, link, mkdir, os, remove, stat, write } from '../src/index.js'

import { TEMP } from './index.js'

const a = async () => {
  await copy('./package.json', TEMP)
  const statData = await stat('./package.json')
  if (!statData) throw new Error('stats should exist')
  if (!statData.isFile()) throw new Error('should be a file')
  if (typeof statData.size !== 'number') throw new Error('invalid size')
}
a.description = 'returns stats for existing file'

const c = async () => {
  const dirPath = `${TEMP}/stat-test-dir`
  await mkdir(dirPath)
  await write(`${dirPath}/test.txt`, 'test')

  try {
    const dirStat = await stat(dirPath)
    if (!dirStat?.isDirectory()) throw new Error('should be a directory')

    const fileStat = await stat(`${dirPath}/*.txt`)
    if (!fileStat?.isFile())
      throw new Error('should find file with glob pattern')
  } finally {
    await remove(dirPath)
  }
}
c.description = 'handles directories and glob patterns'

const d = async () => {
  if (os() === 'windows') return

  const target = `${TEMP}/link-target.txt`
  const linkString = `${TEMP}/test-link`

  await write(target, 'test')
  await link(target, linkString)

  try {
    const statData = await stat(linkString)
    if (!statData) throw new Error('link stats should exist')

    if (!statData.isFile()) throw new Error('should resolve to target file')
  } finally {
    await remove(target)
    await remove(linkString)
  }
}
d.description = 'resolves symbolic links to target stats'

const e = async () => {
  try {
    await stat(null)
    throw new Error('should throw error when stat fails')
  } catch (err) {
    if (!(err instanceof Error))
      throw new Error('error should be instance of Error')
  }
}
e.description = 'throws error on fs.stat failure'

export { a, c, d, e }
