import { $, temp } from './index'

// function

const a = async () => {
  const source = `${temp}/a.txt`
  const content = 'a little message'
  await $.write(source, content)

  if ((await $.read<string>(source)) !== content) throw new Error('0')
}
a.description = '.txt'

const b = async () => {
  const source = `${temp}/b.json`
  const message = 'a little message'
  const content = { message }
  await $.write(source, content)

  if ((await $.read<{ message: string }>(source)).message !== message)
    throw new Error('0')
}
b.description = '.json'

const c = async () => {
  const source = `${temp}/c.txt`
  if (await $.read(source)) throw new Error('0')
}
c.description = 'from an unexisted file'

const d = async () => {
  const source = `${temp}/d.txt`
  const content = 'a little message'
  await $.write(source, content)

  const raw = await $.read(source, { raw: true })
  if (!(raw instanceof Uint8Array)) throw new Error('0')

  const cont = raw.toString()
  if (cont !== content) throw new Error('1')
}
d.description = 'as { raw: true }'

const e = async () => {
  const source = `${temp}/e.yaml`
  const content = 'a little message'
  await $.write(source, `- value: ${content}`)

  const cont = await $.read<[{ value: string }]>(source)
  if (cont[0].value !== content) throw new Error('0')
}
e.description = '.yaml'

// export
export { a, b, c, d, e }
