import { backup, isExist, read, recover, remove, write } from '../src'

import { cleanup, TEMP } from './index'

// Cleanup helper

const a = async () => {
  await cleanup()
  const source = `${TEMP}/test.txt`
  const content = 'test content'

  await write(source, content)
  await backup(source)
  await remove(source)

  await recover(source)

  if (!(await isExist(source))) throw new Error('0')
  if (await isExist(`${source}.bak`)) throw new Error('1')
  const recoveredContent = await read(source)
  if (recoveredContent?.toString() !== content) throw new Error('2')

  await cleanup()
}
a.description = 'recovers a single file'

const b = async () => {
  await cleanup()
  const files = [
    { path: `${TEMP}/file1.txt`, content: 'content1' },
    { path: `${TEMP}/file2.txt`, content: 'content2' },
  ]

  await Promise.all(files.map((f) => write(f.path, f.content)))
  await backup(files.map((f) => f.path))
  await remove(files.map((f) => f.path))

  await recover(files.map((f) => f.path))

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!(await isExist(file.path))) throw new Error(`${i}a`)
    if (await isExist(`${file.path}.bak`)) throw new Error(`${i}b`)
    const content = await read(file.path)
    if (content?.toString() !== file.content) throw new Error(`${i}c`)
  }

  await cleanup()
}
b.description = 'recovers multiple files'

const c = async () => {
  await cleanup()
  const source = `${TEMP}/non-existent.txt`
  await recover(source)
  if (await isExist(source)) throw new Error('0')
  await cleanup()
}
c.description = 'handles non-existent backup files gracefully'

const d = async () => {
  await cleanup()
  const files = Array.from({ length: 3 }, (_, i) => ({
    path: `${TEMP}/concurrent${i}.txt`,
    content: `content${i}`,
  }))

  await Promise.all(files.map((f) => write(f.path, f.content)))
  await backup(files.map((f) => f.path))
  await remove(files.map((f) => f.path))

  await recover(
    files.map((f) => f.path),
    { concurrency: 2 },
  )

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!(await isExist(file.path))) throw new Error(`${i}a`)
    if (await isExist(`${file.path}.bak`)) throw new Error(`${i}b`)
    const content = await read(file.path)
    if (content?.toString() !== file.content) throw new Error(`${i}c`)
  }

  await cleanup()
}
d.description = 'allows custom concurrency setting'

const e = async () => {
  await cleanup()
  const existingFile = `${TEMP}/exists.txt`
  const nonExistingFile = `${TEMP}/not-exists.txt`
  const content = 'test content'

  await write(existingFile, content)
  await backup(existingFile)
  await remove(existingFile)

  await recover([existingFile, nonExistingFile])

  if (!(await isExist(existingFile))) throw new Error('0')
  if (await isExist(`${existingFile}.bak`)) throw new Error('1')
  if (await isExist(nonExistingFile)) throw new Error('2')
  const recoveredContent = await read(existingFile)
  if (recoveredContent?.toString() !== content) throw new Error('3')

  await cleanup()
}
e.description = 'handles mix of existing and non-existing backups'

export { a, b, c, d, e }
