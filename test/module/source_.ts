/* eslint-disable no-await-in-loop */
import { $, temp } from '..'

// function

async function a_(): Promise<void> {

  const listSource = [
    `${temp}/a.txt`,
    `${temp}/b.txt`,
    `${temp}/c.txt`,
  ]
  for (const source of listSource)
    await $.write_(source, 'a little message')
  if ((await $.source_(listSource)).length !== 3) throw new Error('0')
}
a_.description = 'in project'

async function b_(): Promise<void> {

  const listSource = [
    '~/Desktop/a.txt',
    '~/Desktop/b.txt',
    '~/Desktop/c.txt',
  ]
  for (const source of listSource)
    await $.write_(source, 'a little message')
  if ((await $.source_(listSource)).length !== 3) throw new Error('0')
  await $.remove_(listSource) // clean
}
b_.description = 'out of project'

// export
export {
  a_,
  b_,
}
