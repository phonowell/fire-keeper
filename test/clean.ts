import { $, temp } from './index'

// function

const a = async () => {
  const source = `${temp}/a.txt`
  await $.write(source, 'text')
  await $.clean(source)

  if (await $.isExist(source)) throw new Error('0')
  if (await $.isExist($.getDirname(source))) throw new Error('1')
}
a.description = 'normal'

const b = async () => {
  const listSource = [`${temp}/a.txt`, `${temp}/b.txt`]
  await $.write(listSource[0], 'text')
  await $.write(listSource[1], 'text')
  await $.clean(listSource[0])

  if (await $.isExist(listSource[0])) throw new Error('0')
  if (!(await $.isExist($.getDirname(listSource[0])))) throw new Error('1')
}
b.description = 'file existed'

const c = async () => {
  const listSource = [`${temp}/a.txt`, `${temp}/b/b.txt`]
  await $.write(listSource[0], 'text')
  await $.write(listSource[1], 'text')
  await $.clean(listSource[0])

  if (await $.isExist(listSource[0])) throw new Error('0')
  if (!(await $.isExist($.getDirname(listSource[0])))) throw new Error('1')
}
c.description = 'folder existed'

// export
export { a, b, c }
