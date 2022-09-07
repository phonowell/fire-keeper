import { $, temp } from './index'

// function

const a = async () => {
  const source = `${temp}/wr/ite.txt`
  const content = 'a little message'
  await $.write(source, content)

  if ((await $.read<string>(source)) !== content) throw new Error('0')
}
a.description = '.txt'

const b = async () => {
  const source = `${temp}/wr/ite.json`
  const message = 'a little message'
  const content = { message }
  await $.write(source, content)

  const cont = await $.read<{ message: string }>(source)
  if (cont?.message !== message) throw new Error('0')
}
b.description = '.json'

// export
export { a, b }
