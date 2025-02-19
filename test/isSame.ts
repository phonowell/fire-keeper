import { copy, isSame, write } from '../src'

import { TEMP } from './index'

const a = async () => {
  const listSource = ['./readme.md', `${TEMP}/a.md`, `${TEMP}/b.md`]

  await copy(listSource[0], TEMP, 'a.md')
  await copy(listSource[0], TEMP, 'b.md')

  const result = await isSame(listSource)
  if (!result) throw new Error('array of equal files should return true')
}
a.description = 'array of same files'

const b = async () => {
  const listSource = ['./readme.md', `${TEMP}/a.md`, `${TEMP}/b.md`]

  await copy(listSource[0], TEMP, 'a.md')
  await copy(listSource[0], TEMP, 'b.md')

  const result = await isSame(...listSource)
  if (!result)
    throw new Error('spread arguments of equal files should return true')
}
b.description = 'spread of same files'

const c = async () => {
  const nonExistent = [`${TEMP}/null.txt`, './non-existent.md']
  const result = await isSame(nonExistent)
  if (result) throw new Error('non-existent files should return false')
}
c.description = 'non-existent files'

const d = async () => {
  // Test single path input
  const result = await isSame('./readme.md')
  if (result) throw new Error('single file should return false')
}
d.description = 'single file input'

const e = async () => {
  // Test files with different sizes
  const file1 = `${TEMP}/size1.txt`
  const file2 = `${TEMP}/size2.txt`

  await write(file1, 'short')
  await write(file2, 'longer content')

  const result = await isSame(file1, file2)
  if (result) throw new Error('different size files should return false')
}
e.description = 'size mismatch'

const f = async () => {
  // Test files with same size but different content
  const file1 = `${TEMP}/content1.txt`
  const file2 = `${TEMP}/content2.txt`

  await write(file1, 'text1')
  await write(file2, 'text2')

  const result = await isSame(file1, file2)
  if (result)
    throw new Error('same size but different content should return false')
}
f.description = 'content mismatch'

const g = async () => {
  // Test mixed array and string arguments
  const file1 = `${TEMP}/mix1.txt`
  const file2 = `${TEMP}/mix2.txt`
  const file3 = `${TEMP}/mix3.txt`

  const content = 'same content'
  await Promise.all([
    write(file1, content),
    write(file2, content),
    write(file3, content),
  ])

  const result = await isSame([file1, file2], file3)
  if (!result) throw new Error('mixed array and string args should work')
}
g.description = 'mixed arguments'

const h = async () => {
  // Test array flattening
  const file1 = `${TEMP}/flat1.txt`
  const file2 = `${TEMP}/flat2.txt`
  const file3 = `${TEMP}/flat3.txt`

  const content = 'flat content'
  await Promise.all([
    write(file1, content),
    write(file2, content),
    write(file3, content),
  ])

  const result = await isSame([file1], file2, [file3])
  if (!result) throw new Error('array arguments should be flattened')
}
h.description = 'array flattening'

const i = async () => {
  // Test empty array input
  const result = await isSame([])
  if (result) throw new Error('empty array should return false')
}
i.description = 'empty array input'

const j = async () => {
  // Test when normalizePath returns falsy for some paths
  const result = await isSame('./readme.md', '', './license.md')
  if (result)
    throw new Error('paths containing empty strings should return false')
}
j.description = 'falsy path in arguments'

const k = async () => {
  // Test when read() returns null for one file
  // Here we compare an unreadable/non-existent file with a valid one
  const file1 = `${TEMP}/unreadable1.txt`
  const file2 = `${TEMP}/valid2.txt`

  // Only create the second file
  await write(file2, 'some content')

  const result = await isSame(file1, file2)
  if (result)
    throw new Error('comparing with unreadable file should return false')
}
k.description = 'one unreadable file'

const l = async () => {
  // Test when read() returns null for both files
  const file1 = `${TEMP}/unreadable1.txt`
  const file2 = `${TEMP}/unreadable2.txt`

  const result = await isSame(file1, file2)
  if (result)
    throw new Error('comparing two unreadable files should return false')
}
l.description = 'both files unreadable'

export { a, b, c, d, e, f, g, h, i, j, k, l }
