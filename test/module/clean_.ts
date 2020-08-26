import { $, temp } from '..'

// function

async function a_() {
  const source = `${temp}/a.txt`
  await $.write_(source, 'text')
  await $.clean_(source)

  if (await $.isExisted_(source)) throw new Error('0')
  if (await $.isExisted_($.getDirname(source))) throw new Error('1')
}
a_.description = 'normal'

async function b_() {
  const listSource = [
    `${temp}/a.txt`,
    `${temp}/b.txt`
  ]
  await $.write_(listSource[0], 'text')
  await $.write_(listSource[1], 'text')
  await $.clean_(listSource[0])

  if (await $.isExisted_(listSource[0])) throw new Error('0')
  if (!await $.isExisted_($.getDirname(listSource[0]))) throw new Error('1')
}
b_.description = 'file existed'

async function c_() {
  const listSource = [
    `${temp}/a.txt`,
    `${temp}/b/b.txt`
  ]
  await $.write_(listSource[0], 'text')
  await $.write_(listSource[1], 'text')
  await $.clean_(listSource[0])

  if (await $.isExisted_(listSource[0])) throw new Error('0')
  if (!await $.isExisted_($.getDirname(listSource[0]))) throw new Error('1')
}
c_.description = 'folder existed'

// export
export {
  a_,
  b_,
  c_
}