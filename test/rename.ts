import { $, temp } from './index'

const check = async (
  source: string,
  target: string,
  content: string,
): Promise<boolean> => {
  // Source should not exist after rename
  if (await $.isExist(source)) return false
  // Target should exist after rename
  if (!(await $.isExist(target))) return false
  // Content should match
  if (content !== (await $.read<string>(target))) return false
  return true
}

const a = async () => {
  const source = `${temp}/a.txt`
  const target = `${temp}/b.txt`
  const content = 'to be or not to be'

  await $.write(source, content)
  await $.rename(source, 'b.txt')

  if (!(await check(source, target, content)))
    throw new Error('basic rename failed')
}
a.description = 'basic file rename'

const b = async () => {
  // Test directory rename
  const sourceDir = `${temp}/source-dir`
  const targetDir = `${temp}/target-dir`
  const file = `${sourceDir}/test.txt`
  const content = 'directory test'

  await $.mkdir(sourceDir)
  await $.write(file, content)
  await $.rename(sourceDir, 'target-dir')

  if (await $.isExist(sourceDir))
    throw new Error('source directory still exists')
  if (!(await $.isExist(targetDir)))
    throw new Error('target directory not created')
  if (content !== (await $.read<string>(`${targetDir}/test.txt`)))
    throw new Error('directory content mismatch')
}
b.description = 'directory rename'

const c = async () => {
  // Test rename with path that needs normalization
  const source = `${temp}/./normalize/../normalize/file.txt`
  const normalizedSource = `${temp}/normalize/file.txt`
  const target = `${temp}/normalize/renamed.txt`
  const content = 'normalize test'

  await $.mkdir(`${temp}/normalize`)
  await $.write(normalizedSource, content)
  await $.rename(source, 'renamed.txt')

  if (!(await check(normalizedSource, target, content)))
    throw new Error('normalized path rename failed')
}
c.description = 'path normalization'

const d = async () => {
  // Test renaming non-existent source
  try {
    await $.rename(`${temp}/non-existent.txt`, 'target.txt')
    throw new Error('should throw on non-existent source')
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('ENOENT'))
      throw new Error('wrong error for non-existent source')
  }
}
d.description = 'non-existent source'

const e = async () => {
  // Test renaming to invalid target name
  const source = `${temp}/invalid-target.txt`
  await $.write(source, 'test')

  try {
    await $.rename(source, '')
    throw new Error('should throw on empty target name')
  } catch (error) {
    // Clean up test file
    await $.remove(source)

    if (!(error instanceof Error))
      throw new Error('wrong error type for invalid target')
  }
}
e.description = 'invalid target name'

const f = async () => {
  // Test renaming preserves file content
  const source = `${temp}/content.txt`
  const target = `${temp}/preserved.txt`
  const content = 'a'.repeat(1024) // Test with larger content

  await $.write(source, content)
  await $.rename(source, 'preserved.txt')

  if (!(await check(source, target, content)))
    throw new Error('content preservation failed')
}
f.description = 'content preservation'

export { a, b, c, d, e, f }
