import { $, temp } from './index'

// function

const a = async () => {
  const source = './license.md'
  const target = `${temp}/test.md`

  await $.copy(source, temp, 'test.md')
  if (!(await $.isExist(target))) throw new Error('0')

  if (!(await $.isSame(source, target))) throw new Error('1')
}

const b = async () => {
  const source = './license.md'
  const target = `${temp}/new/license.md`

  await $.copy(source, `${temp}/new`)
  if (!(await $.isExist(target))) throw new Error('0')

  if (!(await $.isSame(source, target))) throw new Error('1')
}

const c = async () => {
  if ($.os() !== 'macos') return
  const source = './license.md'
  const target = '~/Downloads/temp/license.md'

  await $.copy(source, '~/Downloads/temp')
  if (!(await $.isExist(target))) throw new Error('0')

  if (!(await $.isSame(source, target))) throw new Error('1')

  // await $.remove('~/Downloads/temp')
}

const d = async () => {
  const source = `${temp}/a.txt`
  const target = `${temp}/b.txt`
  const content = 'a little message'
  await $.write(source, content)

  await $.copy(source, '', 'b.txt')

  if (!(await $.isSame(source, target))) throw new Error('0')
}

// export
export { a, b, c, d }
