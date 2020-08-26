import { $, temp } from '..'

// function

async function a_() {
  const source = `${temp}/source/test.txt`
  const target = `${temp}/target`
  const content = 'a little message'

  await $.write_(source, content)
  await $.move_(source, target)

  if (!await $.isExisted_(`${target}/test.txt`)) throw new Error('0')
}
a_.description = 'file/existed'

async function b_() {
  const source = `${temp}/source/test.txt`
  const target = `${temp}/target`

  await $.move_(source, target)

  if (await $.isExisted_(`${target}/test.txt`)) throw new Error('0')
}
b_.description = 'file/not existed'

async function c_() {
  await $.write_(`${temp}/source/test.txt`, 'a little message')
  await $.move_(`${temp}/source/**/*`, `${temp}/target`)

  if (!await $.isExisted_(`${temp}/target/test.txt`)) throw new Error('0')
}
c_.description = 'folder/existed'

async function d_() {
  await $.move_(`${temp}/source/**/*`, `${temp}/target`)
  if (await $.isExisted_(`${temp}/target/test.txt`)) throw new Error('0')
}
d_.description = 'folder/not existed'

async function e_() {
  const base = '~/Downloads'
  await $.write_(`${base}/source/test.txt`, 'a little message')
  await $.move_(`${base}/source/test.txt`, `${base}/target`)

  if (!await $.isExisted_(`${base}/target/test.txt`)) throw new Error('0')

  await $.remove_([
    `${base}/source`,
    `${base}/target`
  ])
}
e_.description = 'outer/existed'

async function f_() {
  const base = '~/Downloads'
  await $.move_(`${base}/source/test.txt`, `${base}/target`)

  if (await $.isExisted_(`${base}/target/test.txt`)) throw new Error('0')

  await $.remove_([
    `${base}/source`,
    `${base}/target`
  ])
}
f_.description = 'outer/not existed'

async function g_() {
  await $.write_(`${temp}/test.txt`, 'a little message')
  await $.move_(`${temp}/test.txt`, `${temp}/a`, 'b.txt')

  if (!await $.isExisted_(`${temp}/a/b.txt`)) throw new Error('0')
}
g_.description = 'other/move & rename'

// export
export {
  a_,
  b_,
  c_,
  d_,
  e_,
  f_,
  g_
}