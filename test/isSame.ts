import { copy, isSame, write } from '../src/index.js'

import { TEMP } from './index.js'

const testSameFiles = async () => {
  const content = 'same content'
  const files = {
    original: './readme.md',
    copies: [`${TEMP}/a.md`, `${TEMP}/b.md`],
    mixed: [`${TEMP}/mix1.txt`, `${TEMP}/mix2.txt`, `${TEMP}/mix3.txt`],
    flat: [`${TEMP}/flat1.txt`, `${TEMP}/flat2.txt`, `${TEMP}/flat3.txt`],
  }

  await copy(files.original, TEMP, 'a.md')
  await copy(files.original, TEMP, 'b.md')
  await Promise.all([
    ...files.mixed.map((f) => write(f, content)),
    ...files.flat.map((f) => write(f, content)),
  ])

  const tests = [
    {
      name: 'array of same files',
      fn: () => isSame([files.original, ...files.copies]),
      expected: true,
    },
    {
      name: 'spread of same files',
      fn: () => isSame(files.original, ...files.copies),
      expected: true,
    },
    {
      name: 'mixed array and string arguments',
      fn: () => isSame([files.mixed[0], files.mixed[1]], files.mixed[2]),
      expected: true,
    },
    {
      name: 'array flattening',
      fn: () => isSame([files.flat[0]], files.flat[1], [files.flat[2]]),
      expected: true,
    },
  ]

  for (const test of tests) {
    const result = await test.fn()
    if (result !== test.expected)
      throw new Error(`${test.name} failed: expected ${test.expected}`)
  }
}
testSameFiles.description = 'Successful file comparison scenarios'

const testMissingFiles = async () => {
  const result = await isSame(`${TEMP}/null.txt`, './non-existent.md')
  if (result) throw new Error('Should detect non-existent files')
}

const testSingleFile = async () => {
  const result = await isSame('./readme.md')
  if (result) throw new Error('Single file should return false')
}

const testSizeMismatch = async () => {
  await write(`${TEMP}/size1.txt`, 'short')
  await write(`${TEMP}/size2.txt`, 'longer content')
  const result = await isSame(`${TEMP}/size1.txt`, `${TEMP}/size2.txt`)
  if (result) throw new Error('Should detect different file sizes')
}

const testContentMismatch = async () => {
  await write(`${TEMP}/content1.txt`, 'text1')
  await write(`${TEMP}/content2.txt`, 'text2')
  const result = await isSame(`${TEMP}/content1.txt`, `${TEMP}/content2.txt`)
  if (result) throw new Error('Should detect content differences')
}

const testEmptyArray = async () => {
  const result = await isSame([])
  if (result) throw new Error('Empty array should return false')
}

const testInvalidPaths = async () => {
  const result = await isSame('./readme.md', '', './license.md')
  if (result) throw new Error('Should detect invalid paths')
}

const testZeroByteFiles = async () => {
  await write(`${TEMP}/empty1.txt`, '')
  await write(`${TEMP}/empty2.txt`, '')
  const result = await isSame(`${TEMP}/empty1.txt`, `${TEMP}/empty2.txt`)
  if (result) throw new Error('Should reject zero byte files')
}

const testPathNormalization = async () => {
  await write(`${TEMP}/path_norm1`, 'content')
  await write(`${TEMP}/path_norm2`, 'content')

  const paths = [
    `${TEMP}/path_norm1`,
    `${TEMP}/./path_norm1`,
    `${TEMP}/path_norm2/../path_norm2`,
  ]

  const result = await isSame(...paths)
  if (!result) throw new Error('Path normalization comparison failed')
}

export {
  testSameFiles,
  testMissingFiles,
  testSingleFile,
  testSizeMismatch,
  testContentMismatch,
  testEmptyArray,
  testInvalidPaths,
  testZeroByteFiles,
  testPathNormalization,
}
