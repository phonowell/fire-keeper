import { $, temp } from './index'

// function

const a = async () => {
  const source = './license.md'
  const target = `${temp}/test.md`

  await $.copy(source, temp, 'test.md')
  if (!(await $.isExisted(target))) throw new Error('0')

  const listCont = [await $.read(source), await $.read(target)]
  if (listCont[0] !== listCont[1]) throw new Error('1')
}

const b = async () => {
  const source = './license.md'
  const target = `${temp}/new/license.md`

  await $.copy(source, `${temp}/new`)
  if (!(await $.isExisted(target))) throw new Error('0')

  const listCont = [await $.read(source), await $.read(target)]
  if (listCont[0] !== listCont[1]) throw new Error('1')
}

const c = async () => {
  if ($.os() !== 'macos') return
  const source = './license.md'
  const target = '~/Downloads/temp/license.md'

  await $.copy(source, '~/Downloads/temp')
  if (!(await $.isExisted(target))) throw new Error('0')

  const listCont = [await $.read(source), await $.read(target)]
  if (listCont[0] !== listCont[1]) throw new Error('1')

  await $.remove('~/Downloads/temp')
}

const d = async () => {
  const source = `${temp}/a.txt`
  const target = `${temp}/b.txt`
  const content = 'a little message'
  await $.write(source, content)

  await $.copy(source, '', 'b.txt')
  if (!(await $.isExisted(target))) throw new Error('0')

  const cont = await $.read<string>(target)
  if (cont !== content) throw new Error('1')
}

// export
export { a, b, c, d }
