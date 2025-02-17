import type { Options } from 'fast-glob'

import { $, temp } from './index'

type TestPattern = {
  pattern: string | string[]
  count: number
}

type OptionsTest = {
  options: Options
  count: number
}

const formatPattern = (pattern: string | string[]): string =>
  Array.isArray(pattern) ? pattern.join(', ') : pattern

const setupFiles = async () => {
  // Create test directory structure
  const files = [
    'file1.txt',
    'file2.txt',
    'test.js',
    'dir1/nested1.txt',
    'dir1/nested2.txt',
    'dir2/deep/nested.txt',
    '.hidden.txt',
    'special!@#$.txt',
    'file with spaces.txt',
    'dir with spaces/file.txt',
    'unicode文件.txt',
    'dir1/file.test.js',
    'dir1/file.spec.ts',
    'dir2/file.min.js',
    'dir2/deep/file.test.jsx',
  ]

  await Promise.all(
    files.map(file => $.write(`${temp}/${file}`, 'test content')),
  )
}

const cleanup = async () => {
  await $.remove([
    `${temp}/file1.txt`,
    `${temp}/file2.txt`,
    `${temp}/test.js`,
    `${temp}/dir1`,
    `${temp}/dir2`,
    `${temp}/.hidden.txt`,
    `${temp}/special!@#$.txt`,
    `${temp}/file with spaces.txt`,
    `${temp}/dir with spaces`,
    `${temp}/unicode文件.txt`,
    `${temp}/single.txt`,
    `${temp}/a.txt`,
    `${temp}/b.txt`,
    `${temp}/c.txt`,
  ])
}

const a = async () => {
  // 基础输入测试
  const singleFile = `${temp}/single.txt`
  await $.write(singleFile, 'single file content')
  const singleResult = await $.glob(singleFile)
  if (singleResult.length !== 1) throw new Error('single file test failed')

  // 空输入测试
  const emptyResult = await $.glob('')
  if (emptyResult.length !== 0) throw new Error('empty input test failed')

  // ListSource 类型测试
  const listSource = [`${temp}/a.txt`, `${temp}/b.txt`]
  await Promise.all(listSource.map(source => $.write(source, 'test content')))
  const arrayResult = await $.glob(listSource)
  const secondPass = await $.glob(arrayResult)
  if (secondPass !== arrayResult) throw new Error('ListSource test failed')
}
a.description = 'handles basic inputs and empty cases'

const b = async () => {
  await setupFiles()

  // 组合全面的 glob 模式测试
  const tests: TestPattern[] = [
    { pattern: `${temp}/*.txt`, count: 6 },
    { pattern: `${temp}/*/*.txt`, count: 3 },
    { pattern: `${temp}/**/*.txt`, count: 10 },
    {
      pattern: [`${temp}/**/*.js`, `${temp}/**/*.ts`, `!${temp}/**/*.test.*`],
      count: 3,
    },
    { pattern: `${temp}/**/*文件*`, count: 1 },
    { pattern: `${temp}/./dir1/../dir1/*.txt`, count: 2 },
  ]

  for (const { pattern, count } of tests) {
    const results = await $.glob(pattern)
    if (results.length !== count) {
      throw new Error(
        `Pattern "${formatPattern(pattern)}" failed: expected ${count}, got ${results.length}`,
      )
    }
  }
}
b.description =
  'handles glob patterns, special characters and path normalization'

const c = async () => {
  await setupFiles()

  // 选项组合测试
  const tests: OptionsTest[] = [
    { options: { onlyFiles: true, dot: false }, count: 14 },
    { options: { onlyDirectories: true, deep: 2 }, count: 4 },
    { options: { absolute: true }, count: 15 },
    { options: { absolute: true, onlyFiles: false }, count: 19 },
  ]

  for (const { options, count } of tests) {
    const results = await $.glob(`${temp}/**/*`, options)
    if (results.length !== count) {
      throw new Error(
        `Options ${JSON.stringify(options)} failed: expected ${count}, got ${results.length}`,
      )
    }
  }
}
c.description = 'handles various options combinations'

const d = async () => {
  // 边界情况测试
  const cases = [
    { input: [], description: 'empty array' },
    { input: '', description: 'empty string' },
    { input: [''], description: 'array with empty string' },
  ]

  for (const { input, description } of cases) {
    const result = await $.glob(input)
    if (result.length !== 0) {
      throw new Error(`${description} should return empty array`)
    }
    if (!result.__IS_LISTED_AS_SOURCE__ as unknown) {
      throw new Error(`${description} should return ListSource type`)
    }
  }
}
d.description = 'handles edge cases properly'

export { a, b, c, d, cleanup }
