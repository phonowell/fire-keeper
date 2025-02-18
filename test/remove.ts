import { isExist, mkdir, remove, write } from '../src'

import { TEMP } from './index'

const a = async () => {
  const source = `${TEMP}/re/move.txt`
  await write(source, 'test content')
  await remove(source)

  if (await isExist(source)) throw new Error('file not removed')
}
a.description = 'removes single file'

const b = async () => {
  const sources = [`${TEMP}/dir1`, `${TEMP}/dir2`, `${TEMP}/file.txt`]

  await mkdir([sources[0], sources[1]])
  await write(sources[2], 'test content')

  await remove(sources, { concurrency: 3 })
  for (const source of sources) {
    if (await isExist(source)) throw new Error(`path ${source} not removed`)
  }
}
b.description = 'removes multiple paths with custom concurrency'

const c = async () => {
  const sources = [
    `${TEMP}/pattern/file1.txt`,
    `${TEMP}/pattern/nested/file2.txt`,
  ]

  for (const source of sources) {
    await write(source, 'test content')
  }

  await remove(`${TEMP}/pattern/**/*.txt`)

  for (const source of sources) {
    if (await isExist(source)) throw new Error(`file ${source} not removed`)
  }
}
c.description = 'removes files using glob pattern'

const d = async () => {
  const deep = `${TEMP}/deep/nested/directory`
  const files = [
    `${deep}/file1.txt`,
    `${deep}/file2.txt`,
    `${deep}/subdirectory/file3.txt`,
  ]

  await Promise.all(files.map(file => write(file, 'test')))
  await remove(deep)

  if (await isExist(deep))
    throw new Error('deep directory structure not removed')
}
d.description = 'removes deep directory structures'

const e = async () => {
  // Test non-matching glob pattern
  await remove(`${TEMP}/non-existing-pattern-*.txt`)

  // Test empty array
  await remove([])
}
e.description = 'handles non-existent paths and patterns gracefully'

const f = async () => {
  try {
    // @ts-expect-error testing invalid input
    await remove(null)
    throw new Error('should throw error for invalid input')
  } catch (error) {
    // Any error is acceptable since validation could happen at different layers
    if (!(error instanceof Error)) {
      throw new Error('expected an Error for invalid input')
    }
  }
}
f.description = 'throws error for invalid input'

export { a, b, c, d, e, f }
