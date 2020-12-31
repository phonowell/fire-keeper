/* eslint-disable no-await-in-loop */
import { $, temp } from './index'

// function

async function a_() {
  const source = `${temp}/re/move.txt`
  await $.write_(source, 'a little message')
  await $.remove_(source)

  if (await $.isExisted_(source)) throw new Error('0')
}
a_.description = 'single'

async function b_(): Promise<void> {

  const listSource = [
    `${temp}/a`,
    `${temp}/b`,
    `${temp}/c.txt`,
  ]
  await $.mkdir_([listSource[0], listSource[1]])
  await $.write_(listSource[2], 'a little message')
  await $.remove_(listSource)

  if (await $.isExisted_(listSource[0])) throw new Error('0')
  if (await $.isExisted_(listSource[1])) throw new Error('1')
  if (await $.isExisted_(listSource[2])) throw new Error('2')
}
b_.description = 'mutiple'

async function c_(): Promise<void> {

  const listSource = [
    `${temp}/a.txt`,
    `${temp}/b/c.txt`,
  ]
  for (const source of listSource)
    await $.write_(source, 'a little message')
  await $.remove_(`${temp}/**/*.txt`)
  if (await $.isExisted_(listSource[0])) throw new Error('0')
  if (await $.isExisted_(listSource[1])) throw new Error('1')
  if (!await $.isExisted_(`${temp}/b`)) throw new Error('2')
}
c_.description = 'file(s) only'

// export
export {
  a_,
  b_,
  c_,
}
