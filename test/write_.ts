import { $, temp } from './index'

// function

async function a_(): Promise<void> {
  const source = `${temp}/wr/ite.txt`
  const content = 'a little message'
  await $.write_(source, content)

  if ((await $.read_<string>(source)) !== content) throw new Error('0')
}
a_.description = '.txt'

async function b_(): Promise<void> {
  const source = `${temp}/wr/ite.json`
  const message = 'a little message'
  const content = { message }
  await $.write_(source, content)

  const cont = await $.read_<{ message: string }>(source)
  if (cont.message !== message) throw new Error('0')
}
b_.description = '.json'

// export
export {
  a_,
  b_,
}