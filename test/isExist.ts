import { $, temp } from './index'

// function

const a = async () => {
  const source = `${temp}/a.txt`
  const content = 'aloha'
  await $.write(source, content)

  if (!(await $.isExist(source))) throw new Error('0')
}
a.description = 'file/single/existed'

const b = async () => {
  const source = `${temp}/a.txt`
  if (await $.isExist(source)) throw new Error('0')
}
b.description = 'file/single/not existed'

const c = async () => {
  const listSource = [`${temp}/a.txt`, `${temp}/b.txt`, `${temp}/c.txt`]
  const content = 'aloha'
  for (const source of listSource) await $.write(source, content)

  if (!(await $.isExist(listSource))) throw new Error('0')
}
c.description = 'file/mutiple/existed'

const d = async () => {
  const listSource = [`${temp}/a.txt`, `${temp}/b.txt`, `${temp}/c.txt`]
  const content = 'aloha'
  for (const source of listSource) await $.write(source, content)

  await $.remove(listSource[0])

  if (await $.isExist(listSource)) throw new Error('0')
}
d.description = 'file/mutiple/not existed'

const e = async () => {
  const source = `${temp}/a`
  await $.mkdir(source)

  if (!(await $.isExist(source))) throw new Error('0')
}
e.description = 'folder/single/existed'

const f = async () => {
  const source = `${temp}/a`
  if (await $.isExist(source)) throw new Error('0')
}
f.description = 'folder/single/not existed'

const g = async () => {
  const listSource = [`${temp}/a`, `${temp}/b`, `${temp}/c`]
  for (const source of listSource) await $.mkdir(source)

  if (!(await $.isExist(listSource))) throw new Error('0')
}
g.description = 'folder/mutiple/existed'

const h = async () => {
  const listSource = [`${temp}/a`, `${temp}/b`, `${temp}/c`]
  for (const source of listSource) await $.mkdir(source)
  await $.remove(listSource[0])

  if (await $.isExist(listSource)) throw new Error('0')
}
h.description = 'folder/mutiple/not existed'

const i = async () => {
  const listSource = [`${temp}/a`, `${temp}/b`, `${temp}/a/b.txt`]
  await $.mkdir(listSource[0])
  await $.mkdir(listSource[1])
  await $.write(listSource[2], 'aloha')

  if (!(await $.isExist(listSource))) throw new Error('0')
}
i.description = 'file & fold/existed'

const j = async () => {
  const listSource = [`${temp}/a`, `${temp}/b`, `${temp}/a/b.txt`]
  await $.write(listSource[2], 'aloha')

  if (await $.isExist(listSource)) throw new Error('0')
}
j.description = 'file & fold/not existed'

// export
export { a, b, c, d, e, f, g, h, i, j }
