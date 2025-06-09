/*
isSame 模块测试用例说明：
1. 成功场景：
  - 相同文件数组比较
  - 扩展参数形式比较
  - 混合数组和字符串参数
  - 多维数组扁平化处理
2. 失败场景：
  - 文件不存在
  - 单个文件输入
  - 文件大小不同
  - 文件内容不同
  - 空数组输入
  - 包含无效路径参数
  - 路径规范化处理
  - 零字节文件检测
  - 混合不同路径格式
*/

import { copy, isSame, write } from '../src/index.js'

import { TEMP } from './index.js'

// Test successful cases
const testSameFiles = async () => {
  const content = 'same content'
  const files = {
    original: './readme.md',
    copies: [`${TEMP}/a.md`, `${TEMP}/b.md`],
    mixed: [`${TEMP}/mix1.txt`, `${TEMP}/mix2.txt`, `${TEMP}/mix3.txt`],
    flat: [`${TEMP}/flat1.txt`, `${TEMP}/flat2.txt`, `${TEMP}/flat3.txt`],
  }

  // Setup test files
  await copy(files.original, TEMP, 'a.md')
  await copy(files.original, TEMP, 'b.md')
  await Promise.all([
    ...files.mixed.map((f) => write(f, content)),
    ...files.flat.map((f) => write(f, content)),
  ])

  // Test cases
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

// Test missing files scenario
const testMissingFiles = async () => {
  const result = await isSame(`${TEMP}/null.txt`, './non-existent.md')
  if (result) throw new Error('Should detect non-existent files')
}

// Test single file input
const testSingleFile = async () => {
  const result = await isSame('./readme.md')
  if (result) throw new Error('Single file should return false')
}

// Test different file sizes
const testSizeMismatch = async () => {
  await write(`${TEMP}/size1.txt`, 'short')
  await write(`${TEMP}/size2.txt`, 'longer content')
  const result = await isSame(`${TEMP}/size1.txt`, `${TEMP}/size2.txt`)
  if (result) throw new Error('Should detect different file sizes')
}

// Test content mismatch
const testContentMismatch = async () => {
  await write(`${TEMP}/content1.txt`, 'text1')
  await write(`${TEMP}/content2.txt`, 'text2')
  const result = await isSame(`${TEMP}/content1.txt`, `${TEMP}/content2.txt`)
  if (result) throw new Error('Should detect content differences')
}

// Test empty array input
const testEmptyArray = async () => {
  const result = await isSame([])
  if (result) throw new Error('Empty array should return false')
}

// Test invalid path parameters
const testInvalidPaths = async () => {
  const result = await isSame('./readme.md', '', './license.md')
  if (result) throw new Error('Should detect invalid paths')
}

// Test zero byte files
const testZeroByteFiles = async () => {
  await write(`${TEMP}/empty1.txt`, '')
  await write(`${TEMP}/empty2.txt`, '')
  const result = await isSame(`${TEMP}/empty1.txt`, `${TEMP}/empty2.txt`)
  if (result) throw new Error('Should reject zero byte files')
}

// Test path normalization
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
