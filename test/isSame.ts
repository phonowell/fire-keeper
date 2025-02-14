import { $, temp } from './index'

const a = async () => {
  const listSource = ['./readme.md', `${temp}/a.md`, `${temp}/b.md`]

  await $.copy(listSource[0], temp, 'a.md')
  await $.copy(listSource[0], temp, 'b.md')

  const result = await $.isSame(listSource)
  if (!result) throw new Error('array of equal files should return true')
}
a.description = 'array of same files'

const b = async () => {
  const listSource = ['./readme.md', `${temp}/a.md`, `${temp}/b.md`]

  await $.copy(listSource[0], temp, 'a.md')
  await $.copy(listSource[0], temp, 'b.md')

  const result = await $.isSame(...listSource)
  if (!result)
    throw new Error('spread arguments of equal files should return true')
}
b.description = 'spread of same files'

const c = async () => {
  const nonExistent = [`${temp}/null.txt`, './non-existent.md']
  const result = await $.isSame(nonExistent)
  if (result) throw new Error('non-existent files should return false')
}
c.description = 'non-existent files'

const d = async () => {
  // Test single path input
  const result = await $.isSame('./readme.md')
  if (result) throw new Error('single file should return false')
}
d.description = 'single file input'

const e = async () => {
  // Test files with different sizes
  const file1 = `${temp}/size1.txt`
  const file2 = `${temp}/size2.txt`

  await $.write(file1, 'short')
  await $.write(file2, 'longer content')

  const result = await $.isSame(file1, file2)
  if (result) throw new Error('different size files should return false')
}
e.description = 'size mismatch'

const f = async () => {
  // Test files with same size but different content
  const file1 = `${temp}/content1.txt`
  const file2 = `${temp}/content2.txt`

  await $.write(file1, 'text1')
  await $.write(file2, 'text2')

  const result = await $.isSame(file1, file2)
  if (result)
    throw new Error('same size but different content should return false')
}
f.description = 'content mismatch'

const g = async () => {
  // Test mixed array and string arguments
  const file1 = `${temp}/mix1.txt`
  const file2 = `${temp}/mix2.txt`
  const file3 = `${temp}/mix3.txt`

  const content = 'same content'
  await Promise.all([
    $.write(file1, content),
    $.write(file2, content),
    $.write(file3, content),
  ])

  const result = await $.isSame([file1, file2], file3)
  if (!result) throw new Error('mixed array and string args should work')
}
g.description = 'mixed arguments'

const h = async () => {
  // Test array flattening
  const file1 = `${temp}/flat1.txt`
  const file2 = `${temp}/flat2.txt`
  const file3 = `${temp}/flat3.txt`

  const content = 'flat content'
  await Promise.all([
    $.write(file1, content),
    $.write(file2, content),
    $.write(file3, content),
  ])

  const result = await $.isSame([file1], file2, [file3])
  if (!result) throw new Error('array arguments should be flattened')
}
h.description = 'array flattening'

export { a, b, c, d, e, f, g, h }
