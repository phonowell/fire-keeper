/* eslint-disable no-await-in-loop */
import { $, temp } from './index'

// function

const check = async (
  source: string | string[],
  target: string,
  contSource: string
): Promise<boolean> => {

  if (await $.isExisted(source))
    return false

  if (!await $.isExisted(target))
    return false

  if (contSource !== await $.read<string>(target))
    return false

  return true
}

const a = async () => {

  const source = `${temp}/a.txt`
  const target = `${temp}/b.txt`
  const contSource = 'to be or not to be'

  await $.write(source, contSource)
  await $.rename(source, 'b.txt')

  if (!await check(source, target, contSource)) throw new Error('0')
}

const b = async () => {

  const source = `${temp}/a.txt`
  const target = `${temp}/a-test.md`
  const contSource = 'to be or not to be'

  await $.write(source, contSource)
  await $.rename(source, {
    extname: '.md',
    suffix: '-test',
  })

  if (!await check(source, target, contSource)) throw new Error('0')
}

const c = async () => {

  const listFilename: string[] = [0, 1, 2, 3, 4]
    .map((it): string => it.toString())

  for (const filename of listFilename) {
    const source = `${temp}/${filename}.txt`
    const contSource: string = filename
    await $.write(source, contSource)
  }

  await $.rename(`${temp}/*.txt`, {
    extname: '.md',
  })

  for (const filename of listFilename) {
    const source = `${temp}/${filename}.txt`
    const target = `${temp}/${filename}.md`
    const contSource: string = filename
    if (!await check(source, target, contSource)) throw new Error('0')
  }
}

// export
export { a, b, c }
