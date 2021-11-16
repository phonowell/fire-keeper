/* eslint-disable no-await-in-loop */
import { $, temp } from './index'

// function

const check = async (
  source: string | string[],
  target: string,
  content: string,
): Promise<boolean> => {
  if (await $.isExisted(source)) return false
  if (!await $.isExisted(target)) return false
  if (content !== await $.read<string>(target)) return false
  return true
}

const a = async (): Promise<void> => {

  const source = `${temp}/a.txt`
  const target = `${temp}/b.txt`
  const content = 'to be or not to be'

  await $.write(source, content)
  await $.rename(source, 'b.txt')

  if (!await check(source, target, content)) throw new Error('0')
}

const b = async (): Promise<void> => {

  const source = `${temp}/a.txt`
  const target = `${temp}/a-test.md`
  const content = 'to be or not to be'

  await $.write(source, content)
  await $.rename(source, {
    extname: '.md',
    suffix: '-test',
  })

  if (!await check(source, target, content)) throw new Error('0')
}

const c = async (): Promise<void> => {

  const listFilename = [0, 1, 2, 3, 4]
    .map(it => it.toString())

  for (const filename of listFilename) {
    const source = `${temp}/${filename}.txt`
    const content = filename
    await $.write(source, content)
  }

  await $.rename(`${temp}/*.txt`, { extname: '.md' })

  for (const filename of listFilename) {
    const source = `${temp}/${filename}.txt`
    const target = `${temp}/${filename}.md`
    const content = filename
    if (!await check(source, target, content)) throw new Error('0')
  }
}

// export
export { a, b, c }
