import { $, temp } from './index'

const a = async () => {
  const source = `${temp}/re/move.txt`
  await $.write(source, 'a little message')
  await $.remove(source)

  if (await $.isExist(source)) throw new Error('0')
}
a.description = 'single'

const b = async () => {
  const listSource = [`${temp}/a`, `${temp}/b`, `${temp}/c.txt`]
  await $.mkdir([listSource[0], listSource[1]])
  await $.write(listSource[2], 'a little message')
  await $.remove(listSource)

  if (await $.isExist(listSource[0])) throw new Error('0')
  if (await $.isExist(listSource[1])) throw new Error('1')
  if (await $.isExist(listSource[2])) throw new Error('2')
}
b.description = 'mutiple'

const c = async () => {
  const listSource = [`${temp}/a.txt`, `${temp}/b/c.txt`]
  for (const source of listSource) await $.write(source, 'a little message')
  await $.remove(`${temp}/**/*.txt`)
  if (await $.isExist(listSource[0])) throw new Error('0')
  if (await $.isExist(listSource[1])) throw new Error('1')
  if (!(await $.isExist(`${temp}/b`))) throw new Error('2')
}
c.description = 'file(s) only'

export { a, b, c }
