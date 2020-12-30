import { $, temp } from '..'

// function

async function a_(): Promise<void> {

  const source = `${temp}/m/k/d/i/r`
  await $.mkdir_(source)

  if (!await $.isExisted_(source)) throw new Error('0')
}
a_.description = 'single'

async function b_(): Promise<void> {

  const listSource = [
    `${temp}/a`,
    `${temp}/b`,
    `${temp}/c`,
  ]
  await $.mkdir_(listSource)

  if (!await $.isExisted_(listSource)) throw new Error('0')
}
b_.description = 'multiple'

// export
export {
  a_,
  b_,
}
