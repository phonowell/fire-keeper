import { copy, isSame, write } from '../src'

import { TEMP } from './index'

// Test successful cases
const successCases = async () => {
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
    ...files.mixed.map(f => write(f, content)),
    ...files.flat.map(f => write(f, content)),
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
    if (result !== test.expected) {
      throw new Error(`${test.name} failed: expected ${test.expected}`)
    }
  }
}
successCases.description = 'successful comparison cases'

// Test failure cases
const failureCases = async () => {
  const tests = [
    {
      name: 'non-existent files',
      fn: () => isSame([`${TEMP}/null.txt`, './non-existent.md']),
    },
    {
      name: 'single file input',
      fn: () => isSame('./readme.md'),
    },
    {
      name: 'size mismatch',
      setup: async () => {
        await write(`${TEMP}/size1.txt`, 'short')
        await write(`${TEMP}/size2.txt`, 'longer content')
      },
      fn: () => isSame(`${TEMP}/size1.txt`, `${TEMP}/size2.txt`),
    },
    {
      name: 'content mismatch',
      setup: async () => {
        await write(`${TEMP}/content1.txt`, 'text1')
        await write(`${TEMP}/content2.txt`, 'text2')
      },
      fn: () => isSame(`${TEMP}/content1.txt`, `${TEMP}/content2.txt`),
    },
    {
      name: 'empty array input',
      fn: () => isSame([]),
    },
    {
      name: 'falsy path in arguments',
      fn: () => isSame('./readme.md', '', './license.md'),
    },
    {
      name: 'one unreadable file',
      setup: async () => {
        await write(`${TEMP}/valid2.txt`, 'some content')
      },
      fn: () => isSame(`${TEMP}/unreadable1.txt`, `${TEMP}/valid2.txt`),
    },
    {
      name: 'both files unreadable',
      fn: () => isSame(`${TEMP}/unreadable1.txt`, `${TEMP}/unreadable2.txt`),
    },
  ]

  for (const test of tests) {
    await test.setup?.()
    const result = await test.fn()
    if (result) {
      throw new Error(`${test.name} should return false`)
    }
  }
}
failureCases.description = 'failure cases'

export { successCases, failureCases }
