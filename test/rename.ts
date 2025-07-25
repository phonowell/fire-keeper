import { isExist, link, mkdir, os, read, rename, write } from '../src/index.js'

import { TEMP } from './index.js'

const check = async (
  source: string,
  target: string,
  content: string,
): Promise<boolean> => {
  if (await isExist(source)) return false

  if (!(await isExist(target))) return false

  if (content !== (await read<string>(target))) return false
  return true
}

const a = async () => {
  const source = `${TEMP}/a.txt`
  const target = `${TEMP}/b.txt`
  const content = 'to be or not to be'

  await write(source, content)
  await rename(source, 'b.txt')

  if (!(await check(source, target, content)))
    throw new Error('basic rename failed')
}
a.description = 'basic file rename'

const b = async () => {
  const sourceDir = `${TEMP}/source-dir`
  const targetDir = `${TEMP}/target-dir`
  const file = `${sourceDir}/test.txt`
  const content = 'directory test'

  await mkdir(sourceDir)
  await write(file, content)
  await rename(sourceDir, 'target-dir')

  if (await isExist(sourceDir)) throw new Error('source directory still exists')
  if (!(await isExist(targetDir)))
    throw new Error('target directory not created')
  if (content !== (await read<string>(`${targetDir}/test.txt`)))
    throw new Error('directory content mismatch')
}
b.description = 'directory rename'

const c = async () => {
  const source = `${TEMP}/./normalize/../normalize/file.txt`
  const normalizedSource = `${TEMP}/normalize/file.txt`
  const target = `${TEMP}/normalize/renamed.txt`
  const content = 'normalize test'

  await mkdir(`${TEMP}/normalize`)
  await write(normalizedSource, content)
  await rename(source, 'renamed.txt')

  if (!(await check(normalizedSource, target, content)))
    throw new Error('normalized path rename failed')
}
c.description = 'path normalization'

const d = async () => {
  try {
    await rename(`${TEMP}/non-existent.txt`, 'target.txt')
    throw new Error('should throw on non-existent source')
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('ENOENT'))
      throw new Error('wrong error for non-existent source')
  }
}
d.description = 'non-existent source'

const e = async () => {
  const source = `${TEMP}/special!@#$.txt`
  const target = `${TEMP}/renamed!@#$.txt`
  const content = 'special chars test'

  await write(source, content)
  await rename(source, 'renamed!@#$.txt')

  if (!(await check(source, target, content)))
    throw new Error('special characters rename failed')
}
e.description = 'special characters'

const f = async () => {
  const source = `${TEMP}/文件.txt`
  const target = `${TEMP}/改名.txt`
  const content = 'unicode test'

  await write(source, content)
  await rename(source, '改名.txt')

  if (!(await check(source, target, content)))
    throw new Error('unicode rename failed')
}
f.description = 'unicode filenames'

const g = async () => {
  const source = `${TEMP}/case.txt`
  const target = `${TEMP}/CASE.txt`
  const content = 'case test'

  await write(source, content)

  try {
    await rename(source, 'CASE.txt')

    if (!(await isExist(target)))
      throw new Error('case-insensitive rename failed')
  } catch (err) {
    if (!(err instanceof Error))
      throw new Error('wrong error type for case sensitivity')

    if (!(await isExist(source)))
      throw new Error('source missing after failed case-sensitive rename')
  }
}
g.description = 'case sensitivity'

const h = async () => {
  const sourceDir = `${TEMP}/source`
  const targetDir = `${TEMP}/target`
  const content = 'cross directory test'

  await mkdir([sourceDir, targetDir])
  await write(`${sourceDir}/file.txt`, content)
  await rename(`${sourceDir}/file.txt`, '../target/moved.txt')

  if (await isExist(`${sourceDir}/file.txt`))
    throw new Error('source file still exists')
  if (!(await isExist(`${targetDir}/moved.txt`)))
    throw new Error('target file not created')
}
h.description = 'cross-directory rename'

const i = async () => {
  if (os() === 'windows') return

  const target = `${TEMP}/link-target.txt`
  const source = `${TEMP}/link.txt`
  const renamed = `${TEMP}/renamed-link.txt`
  const content = 'symlink test'

  await write(target, content)
  await link(target, source)
  await rename(source, 'renamed-link.txt')

  if (await isExist(source)) throw new Error('source link still exists')
  if (!(await isExist(renamed))) throw new Error('renamed link not created')
  if (content !== (await read<string>(renamed)))
    throw new Error('symlink content mismatch')
}
i.description = 'symlink rename'

const j = async () => {
  const deep = `${TEMP}/deep/nested/path`
  const source = `${deep}/file.txt`
  const target = `${deep}/renamed.txt`
  const content = 'deep path test'

  await mkdir(deep)
  await write(source, content)
  await rename(source, 'renamed.txt')

  if (!(await check(source, target, content)))
    throw new Error('deep path rename failed')
}
j.description = 'deep path rename'

export { a, b, c, d, e, f, g, h, i, j }
