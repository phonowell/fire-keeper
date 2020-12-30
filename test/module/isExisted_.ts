/* eslint-disable no-await-in-loop */
import { $, temp } from '..'

// function

async function a_(): Promise<void> {

  const source = `${temp}/a.txt`
  const content = 'aloha'
  await $.write_(source, content)

  if (!await $.isExisted_(source)) throw new Error('0')
}
a_.description = 'file/single/existed'

async function b_(): Promise<void> {

  const source = `${temp}/a.txt`
  if (await $.isExisted_(source)) throw new Error('0')
}
b_.description = 'file/single/not existed'

async function c_(): Promise<void> {

  const listSource = [
    `${temp}/a.txt`,
    `${temp}/b.txt`,
    `${temp}/c.txt`,
  ]
  const content = 'aloha'
  for (const source of listSource)
    await $.write_(source, content)

  if (!await $.isExisted_(listSource)) throw new Error('0')
}
c_.description = 'file/mutiple/existed'

async function d_(): Promise<void> {

  const listSource = [
    `${temp}/a.txt`,
    `${temp}/b.txt`,
    `${temp}/c.txt`,
  ]
  const content = 'aloha'
  for (const source of listSource)
    await $.write_(source, content)

  await $.remove_(listSource[0])

  if (await $.isExisted_(listSource)) throw new Error('0')
}
d_.description = 'file/mutiple/not existed'

async function e_(): Promise<void> {

  const source = `${temp}/a`
  await $.mkdir_(source)

  if (!await $.isExisted_(source)) throw new Error('0')
}
e_.description = 'folder/single/existed'

async function f_(): Promise<void> {

  const source = `${temp}/a`
  if (await $.isExisted_(source)) throw new Error('0')
}
f_.description = 'folder/single/not existed'

async function g_(): Promise<void> {

  const listSource = [
    `${temp}/a`,
    `${temp}/b`,
    `${temp}/c`,
  ]
  for (const source of listSource)
    await $.mkdir_(source)

  if (!await $.isExisted_(listSource)) throw new Error('0')
}
g_.description = 'folder/mutiple/existed'

async function h_(): Promise<void> {

  const listSource = [
    `${temp}/a`,
    `${temp}/b`,
    `${temp}/c`,
  ]
  for (const source of listSource)
    await $.mkdir_(source)
  await $.remove_(listSource[0])

  if (await $.isExisted_(listSource)) throw new Error('0')
}
h_.description = 'folder/mutiple/not existed'

async function i_(): Promise<void> {

  const listSource = [
    `${temp}/a`,
    `${temp}/b`,
    `${temp}/a/b.txt`,
  ]
  await $.mkdir_(listSource[0])
  await $.mkdir_(listSource[1])
  await $.write_(listSource[2], 'aloha')

  if (!await $.isExisted_(listSource)) throw new Error('0')
}
i_.description = 'file & fold/existed'

async function j_(): Promise<void> {

  const listSource = [
    `${temp}/a`,
    `${temp}/b`,
    `${temp}/a/b.txt`,
  ]
  await $.write_(listSource[2], 'aloha')

  if (await $.isExisted_(listSource)) throw new Error('0')
}
j_.description = 'file & fold/not existed'

// export
export {
  a_,
  b_,
  c_,
  d_,
  e_,
  f_,
  g_,
  h_,
  i_,
  j_,
}
