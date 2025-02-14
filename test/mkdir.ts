import { $, temp } from './index'

const a = async () => {
  const source = `${temp}/m/k/d/i/r`
  await $.mkdir(source)

  if (!(await $.isExist(source))) throw new Error('0')
}
a.description = 'single'

const b = async () => {
  const listSource = [`${temp}/a`, `${temp}/b`, `${temp}/c`]
  await $.mkdir(listSource)

  if (!(await $.isExist(listSource))) throw new Error('0')
}
b.description = 'multiple'

// export
export { a, b }
