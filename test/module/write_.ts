import { $, temp } from '..'

// function

async function a_() {
  const source = `${temp}/wr/ite.txt`
  const content = 'a little message'
  await $.write_(source, content)

  if ((await $.read_(source) as string) !== content) throw new Error('0')
}
a_.description = '.txt'

async function b_() {
  const source = `${temp}/wr/ite.json`
  const message = 'a little message'
  const content = { message }
  await $.write_(source, content)

  const cont:{message:string} = await $.read_(source) as { message: string }
  if (cont.message !== message) throw new Error('0')
}
b_.description = '.json'

// export
export {
  a_,
  b_
}