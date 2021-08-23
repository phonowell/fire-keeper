import { $, temp } from './index'

// function

const a = async () => {

  const source = `${temp}/m/k/d/i/r`
  await $.mkdir(source)

  if (!await $.isExisted(source)) throw new Error('0')
}
a.description = 'single'

const b = async () => {

  const listSource = [
    `${temp}/a`,
    `${temp}/b`,
    `${temp}/c`,
  ]
  await $.mkdir(listSource)

  if (!await $.isExisted(listSource)) throw new Error('0')
}
b.description = 'multiple'

// export
export { a, b }
