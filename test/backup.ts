import path from 'path'

import { $, temp } from './index'

const singleFileBackup = async () => {
  const source = `${temp}/test.txt`
  const content = 'test content'
  await $.write(source, content)
  await $.backup(source)

  const backupFile = `${source}.bak`
  if (!(await $.isExist(backupFile))) throw new Error('backup file not created')
  const backupContent = await $.read(backupFile)
  if (!backupContent) throw new Error('backup content not found')
  if (backupContent.toString() !== content) throw new Error('content mismatch')
}
singleFileBackup.description = 'backs up single file'

const multipleFilesBackup = async () => {
  const files = [
    { path: `${temp}/file1.txt`, content: 'content1' },
    { path: `${temp}/file2.txt`, content: 'content2' },
  ]
  await Promise.all(files.map(f => $.write(f.path, f.content)))
  await $.backup(files.map(f => f.path))

  for (const file of files) {
    const backupFile = `${file.path}.bak`
    if (!(await $.isExist(backupFile)))
      throw new Error(`backup not created for ${file.path}`)
    const backupContent = await $.read(backupFile)
    if (!backupContent)
      throw new Error(`backup content not found for ${file.path}`)
    if (backupContent.toString() !== file.content)
      throw new Error(`content mismatch for ${file.path}`)
  }
}
multipleFilesBackup.description = 'backs up multiple files'

const directoryBackup = async () => {
  const dir = `${temp}/backup-test`
  const structure = {
    'file1.txt': 'content1',
    'nested/file2.txt': 'content2',
    'nested/deep/file3.txt': 'content3',
  }

  for (const [filePath, content] of Object.entries(structure)) {
    const fullPath = path.join(dir, filePath)
    await $.mkdir(path.dirname(fullPath))
    await $.write(fullPath, content)
  }

  await $.backup(`${dir}/**/*`)

  for (const [filePath, content] of Object.entries(structure)) {
    const fullPath = path.join(dir, filePath)
    const backupFile = `${fullPath}.bak`
    if (!(await $.isExist(backupFile)))
      throw new Error(`backup not created for ${filePath}`)
    const backupContent = await $.read(backupFile)
    if (!backupContent)
      throw new Error(`backup content not found for ${filePath}`)
    if (backupContent.toString() !== content)
      throw new Error(`content mismatch for ${filePath}`)
  }
}
directoryBackup.description = 'backs up directory structure'

const edgeCases = async () => {
  // Test special characters and different file types
  const testCases = [
    { name: 'special!@#$.txt', content: 'test1' },
    { name: '文件.txt', content: 'test2' },
    { name: 'binary.bin', content: Buffer.from([1, 2, 3, 4]) },
    { name: 'empty.txt', content: Buffer.from('') },
  ]

  for (const tc of testCases) {
    const source = `${temp}/${tc.name}`
    await $.write(source, tc.content)
    await $.backup(source)

    const backupFile = `${source}.bak`
    if (!(await $.isExist(backupFile)))
      throw new Error(`backup failed for ${tc.name}`)

    const backupContent = await $.read(backupFile, {
      raw: tc.content instanceof Buffer,
    })

    if (tc.content instanceof Buffer) {
      if (!backupContent || !Buffer.from(backupContent).equals(tc.content))
        throw new Error(`content mismatch for ${tc.name}`)
    }
  }
}
edgeCases.description = 'handles special cases and different file types'

const errorHandling = async () => {
  // Test non-existent files and overwriting
  const source = `${temp}/not-exist.txt`
  await $.backup(source)
  if (await $.isExist(`${source}.bak`))
    throw new Error('backup created for non-existent file')

  // Test overwriting
  const overwriteSource = `${temp}/overwrite.txt`
  await $.write(overwriteSource, 'original')
  await $.backup(overwriteSource)
  await $.write(overwriteSource, 'updated')
  await $.backup(overwriteSource)

  const backupContent = await $.read(`${overwriteSource}.bak`)
  if (!backupContent) throw new Error('backup not found')
  if (backupContent.toString() !== 'updated')
    throw new Error('backup not overwritten')
}
errorHandling.description = 'handles errors and overwrites correctly'

// Cleanup helper
const cleanup = async () => {
  await $.remove([
    `${temp}/test.txt*`,
    `${temp}/file*.txt*`,
    `${temp}/backup-test`,
    `${temp}/special!@#$.txt*`,
    `${temp}/文件.txt*`,
    `${temp}/binary.bin*`,
    `${temp}/empty.txt*`,
    `${temp}/not-exist.txt*`,
    `${temp}/overwrite.txt*`,
  ])
}

export {
  singleFileBackup,
  multipleFilesBackup,
  directoryBackup,
  edgeCases,
  errorHandling,
  cleanup,
}
