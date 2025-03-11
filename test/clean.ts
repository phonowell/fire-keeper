import { clean, getDirname, isExist, mkdir, write } from '../src'

import { TEMP } from './index'

const a = async () => {
  const source = `${TEMP}/a.txt`
  await write(source, 'text')
  await clean(source)

  if (await isExist(source)) throw new Error('0')
  if (await isExist(getDirname(source))) throw new Error('1')
}
a.description = 'single file'

const b = async () => {
  const listSource = [`${TEMP}/a.txt`, `${TEMP}/b.txt`]
  await write(listSource[0], 'text')
  await write(listSource[1], 'text')
  await clean(listSource[0])

  if (await isExist(listSource[0])) throw new Error('0')
  if (!(await isExist(getDirname(listSource[0])))) throw new Error('1')
}
b.description = 'file with sibling'

const c = async () => {
  const listSource = [`${TEMP}/a.txt`, `${TEMP}/b/b.txt`]
  await write(listSource[0], 'text')
  await write(listSource[1], 'text')
  await clean(listSource[0])

  if (await isExist(listSource[0])) throw new Error('0')
  if (!(await isExist(getDirname(listSource[0])))) throw new Error('1')
}
c.description = 'nested structure'

const d = async () => {
  // Test array input
  const listSource = [`${TEMP}/d1.txt`, `${TEMP}/d2.txt`]
  await Promise.all(listSource.map((f) => write(f, 'text')))
  await clean(listSource)

  if (await isExist(listSource[0])) throw new Error('0')
  if (await isExist(listSource[1])) throw new Error('1')
  if (await isExist(getDirname(listSource[0]))) throw new Error('2')
}
d.description = 'array input'

const e = async () => {
  // Test empty directory cleanup
  const dir = `${TEMP}/empty`
  const file = `${dir}/e.txt`
  await mkdir(dir)
  await write(file, 'text')
  await clean(file)

  if (await isExist(file)) throw new Error('0')
  if (await isExist(dir)) throw new Error('1')
}
e.description = 'empty directory cleanup'

const f = async () => {
  // Test non-existent file
  const nonExistent = `${TEMP}/non-existent.txt`
  await clean(nonExistent)

  if (await isExist(nonExistent)) throw new Error('0')
  if (await isExist(getDirname(nonExistent))) throw new Error('1')
}
f.description = 'non-existent file'

export { a, b, c, d, e, f }
