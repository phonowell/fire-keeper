import { $, temp } from '..'

// function

async function check_(
  source: string | string[],
  target: string,
  contSource: string
): Promise<boolean> {

  if (await $.isExisted_(source))
    return false

  if (!await $.isExisted_(target))
    return false

  if (contSource !== await $.read_(target))
    return false

  return true
}

async function a_(): Promise<void> {

  const source: string = `${temp}/a.txt`
  const target: string = `${temp}/b.txt`
  const contSource: string = 'to be or not to be'

  await $.write_(source, contSource)
  await $.rename_(source, 'b.txt')

  if (!await check_(source, target, contSource)) throw new Error('0')
}

async function b_(): Promise<void> {

  const source: string = `${temp}/a.txt`
  const target: string = `${temp}/a-test.md`
  const contSource: string = 'to be or not to be'

  await $.write_(source, contSource)
  await $.rename_(source, {
    extname: '.md',
    suffix: '-test'
  })

  if (!await check_(source, target, contSource)) throw new Error('0')
}

async function c_(): Promise<void> {

  const listFilename: string[] = [0, 1, 2, 3, 4]
    .map((it): string => it.toString())

  for (const filename of listFilename) {
    const source: string = `${temp}/${filename}.txt`
    const contSource: string = filename
    await $.write_(source, contSource)
  }

  await $.rename_(`${temp}/*.txt`, {
    extname: '.md'
  })

  for (const filename of listFilename) {
    const source: string = `${temp}/${filename}.txt`
    const target: string = `${temp}/${filename}.md`
    const contSource: string = filename
    if (!await check_(source, target, contSource)) throw new Error('0')
  }
}

// export
export {
  a_,
  b_,
  c_
}