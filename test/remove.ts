import { $, temp } from './index'

// function

const a = async () => {
  const source = `${temp}/re/move.txt`
  await $.write(source, 'a little message')
  await $.remove(source)

  if (await $.isExisted(source)) throw new Error('0')
}
a.description = 'single'

const b = async () => {
  const listSource = [`${temp}/a`, `${temp}/b`, `${temp}/c.txt`]
  await $.mkdir([listSource[0], listSource[1]])
  await $.write(listSource[2], 'a little message')
  await $.remove(listSource)

  if (await $.isExisted(listSource[0])) throw new Error('0')
  if (await $.isExisted(listSource[1])) throw new Error('1')
  if (await $.isExisted(listSource[2])) throw new Error('2')
}
b.description = 'mutiple'

const c = async () => {
  const listSource = [`${temp}/a.txt`, `${temp}/b/c.txt`]
  for (const source of listSource) await $.write(source, 'a little message')
  await $.remove(`${temp}/**/*.txt`)
  if (await $.isExisted(listSource[0])) throw new Error('0')
  if (await $.isExisted(listSource[1])) throw new Error('1')
  if (!(await $.isExisted(`${temp}/b`))) throw new Error('2')
}
c.description = 'file(s) only'

// export
export { a, b, c }
