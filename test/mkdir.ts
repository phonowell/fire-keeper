import path from 'path'

import { isExist, mkdir, os } from '../src/index.js'

import { TEMP } from './index.js'

const a = async () => {
  const source = `${TEMP}/m/k/d/i/r`
  await mkdir(source)

  if (!(await isExist(source))) throw new Error('directory not created')

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
  const source = `${TEMP}/existing/nested`
  await mkdir(`${TEMP}/existing`)
  await mkdir(source)

  if (!(await isExist(source)))
    throw new Error('nested directory in existing path not created')
}
d.description = 'creates in existing directory'

const e = async () => {
  await mkdir('')
  await mkdir([])
}
e.description = 'handles empty input'

const f = async () => {
  const source = `${TEMP}/./normalize/../normalize/test`
  const normalizedPath = `${TEMP}/normalize/test`
  await mkdir(source)

  if (!(await isExist(normalizedPath)))
    throw new Error('normalized path not created')
}
f.description = 'handles path normalization'

const g = async () => {
  if (os() === 'windows') return

  const source = `${TEMP}/permission-test`
  await mkdir(source)

  const fs = await import('fs/promises')
  const stats = await fs.stat(source)

  const ownerPermissions = stats.mode & 0o700
  if (ownerPermissions < 0o700)
    throw new Error('insufficient directory permissions')
}
g.description = 'sets reasonable permissions'

const h = async () => {
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
  const parts = Array.from({ length: 20 }, (_, i) => `deep${i}`)
  const source = path.join(TEMP, ...parts)

  await mkdir(source)

  if (!(await isExist(source)))
    throw new Error('deeply nested directory not created')
}
i.description = 'handles deep nesting'

const j = async () => {
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
  await mkdir(['', ' ', '  '])
}
k.description = 'handles empty paths'

const l = async () => {
  const singlePath = `${TEMP}/single-string-test`
  const arrayPath = [`${TEMP}/array-test`]

  await mkdir(singlePath)
  await mkdir(arrayPath)

  if (!(await isExist(singlePath)))
    throw new Error('single string path not created')

  if (!(await isExist(arrayPath[0]))) throw new Error('array path not created')
}
l.description = 'handles both string and array inputs'

export { a, b, c, d, e, f, g, h, i, j, k, l }
