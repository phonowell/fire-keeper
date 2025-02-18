import { strict as assert } from 'assert'

import { $, temp } from './index'

const singleFileRecover = async () => {
  const source = `${temp}/test.txt`
  const content = 'test content'

  // Setup
  await $.write(source, content)
  await $.backup(source)
  await $.remove(source)

  // Test recovery
  await $.recover(source)

  if (!(await $.isExist(source))) throw new Error('file not recovered')
  if (await $.isExist(`${source}.bak`))
    throw new Error('backup file not removed')
  const recoveredContent = await $.read(source)
  if (recoveredContent?.toString() !== content)
    throw new Error('content mismatch')
}
singleFileRecover.description = 'recovers single file'

const multipleFilesRecover = async () => {
  const files = [
    { path: `${temp}/file1.txt`, content: 'content1' },
    { path: `${temp}/file2.txt`, content: 'content2' },
  ]

  // Setup
  await Promise.all(files.map(f => $.write(f.path, f.content)))
  await $.backup(files.map(f => f.path))
  await $.remove(files.map(f => f.path))

  // Test recovery
  await $.recover(files.map(f => f.path))

  for (const file of files) {
    if (!(await $.isExist(file.path)))
      throw new Error(`file not recovered: ${file.path}`)
    if (await $.isExist(`${file.path}.bak`))
      throw new Error(`backup file not removed: ${file.path}`)
    const content = await $.read(file.path)
    if (content?.toString() !== file.content)
      throw new Error(`content mismatch for ${file.path}`)
  }
}
multipleFilesRecover.description = 'recovers multiple files'

const concurrentAndEmptyRecover = async () => {
  const source = `${temp}/concurrent.txt`
  const content = 'test'

  // Setup for concurrent recovery
  await $.write(source, content)
  await $.backup(source)
  await $.remove(source)

  // Test with isConcurrent true
  await $.recover(source, { isConcurrent: true })
  assert(await $.isExist(source), 'file not recovered (concurrent)')
  assert(!(await $.isExist(`${source}.bak`)), 'backup not removed (concurrent)')

  // Setup for sequential recovery
  await $.write(source, content)
  await $.backup(source)
  await $.remove(source)

  // Test with isConcurrent false
  await $.recover(source, { isConcurrent: false })
  assert(await $.isExist(source), 'file not recovered (sequential)')
  assert(!(await $.isExist(`${source}.bak`)), 'backup not removed (sequential)')

  // Test non-existent pattern
  const nonExistentPattern = `${temp}/non-existent-*.txt`
  await $.recover(nonExistentPattern)
}
concurrentAndEmptyRecover.description =
  'tests concurrent options and empty glob pattern'

const errorHandling = async () => {
  // Test non-existent backup
  const source = `${temp}/not-exist.txt`
  await $.recover(source)
  assert(!(await $.isExist(source)), 'file created without backup')

  // Test partial recovery failure
  const files = [`${temp}/exists.txt`, `${temp}/not-exists.txt`]
  await $.write(files[0], 'test')
  await $.backup(files[0])
  await $.remove(files[0])

  await $.recover(files)
  assert(await $.isExist(files[0]), 'existing backup not recovered')
  assert(!(await $.isExist(files[1])), 'non-existent backup recovered')
}
errorHandling.description = 'handles errors correctly'

// Cleanup helper
const cleanup = async () => {
  await $.remove([
    `${temp}/test.txt*`,
    `${temp}/file*.txt*`,
    `${temp}/recover-test`,
    `${temp}/concurrent.txt*`,
    `${temp}/exists.txt*`,
    `${temp}/not-exists.txt*`,
  ])
}

export {
  singleFileRecover,
  multipleFilesRecover,
  concurrentAndEmptyRecover,
  errorHandling,
  cleanup,
}
