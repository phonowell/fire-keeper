import { $, temp } from './index'

const a = async () => {
  const source = `${temp}/source/test.txt`
  const target = `${temp}/target`
  const content = 'a little message'

  await $.write(source, content)
  await $.move(source, target)

  if (!(await $.isExist(`${target}/test.txt`))) throw new Error('0')
}
a.description = 'file/existed'

const b = async () => {
  const source = `${temp}/source/test.txt`
  const target = `${temp}/target`

  await $.move(source, target)

  if (await $.isExist(`${target}/test.txt`)) throw new Error('0')
}
b.description = 'file/not existed'

const c = async () => {
  await $.write(`${temp}/source/test.txt`, 'a little message')
  await $.move(`${temp}/source/**/*`, `${temp}/target`)

  if (!(await $.isExist(`${temp}/target/test.txt`))) throw new Error('0')
}
c.description = 'folder/existed'

const d = async () => {
  await $.move(`${temp}/source/**/*`, `${temp}/target`)
  if (await $.isExist(`${temp}/target/test.txt`)) throw new Error('0')
}
d.description = 'folder/not existed'

const e = async () => {
  const base = '~/Downloads'
  await $.write(`${base}/source/test.txt`, 'a little message')
  await $.move(`${base}/source/test.txt`, `${base}/target`)

  if (!(await $.isExist(`${base}/target/test.txt`))) throw new Error('0')

  await $.remove([`${base}/source`, `${base}/target`])
}
e.description = 'outer/existed'

const f = async () => {
  const base = '~/Downloads'
  await $.move(`${base}/source/test.txt`, `${base}/target`)

  if (await $.isExist(`${base}/target/test.txt`)) throw new Error('0')

  await $.remove([`${base}/source`, `${base}/target`])
}
f.description = 'outer/not existed'

export { a, b, c, d, e, f }
