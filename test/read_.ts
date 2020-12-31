import { $, temp } from './index'

// function

async function a_(): Promise<void> {

  const source = `${temp}/a.txt`
  const content = 'a little message'
  await $.write_(source, content)

  if (await $.read_(source) !== content) throw new Error('0')
}
a_.description = '.txt'

async function b_(): Promise<void> {

  const source = `${temp}/b.json`
  const message = 'a little message'
  const content = { message }
  await $.write_(source, content)

  if ((await $.read_(source) as { message: string }).message !== message) throw new Error('0')
}
b_.description = '.json'

async function c_(): Promise<void> {

  const source = `${temp}/c.txt`
  if (await $.read_(source)) throw new Error('0')
}
c_.description = 'from an unexisted file'

async function d_(): Promise<void> {

  const source = `${temp}/d.txt`
  const content = 'a little message'
  await $.write_(source, content)

  const raw = await $.read_(source, { raw: true })
  if (!(raw instanceof Uint8Array)) throw new Error('0')

  const cont = raw.toString()
  if (cont !== content) throw new Error('1')
}
d_.description = 'as { raw: true }'

async function e_(): Promise<void> {

  const source = `${temp}/e.yaml`
  const content = 'a little message'
  await $.write_(source, `- value: ${content}`)

  const cont = await $.read_(source) as [{ value: string }]
  if (cont[0].value !== content) throw new Error('0')
}
e_.description = '.yaml'

// export
export {
  a_,
  b_,
  c_,
  d_,
  e_,
}
