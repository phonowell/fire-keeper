import { $, temp } from './index'

// function

async function a_(): Promise<void> {

  const source = './license.md'
  const target = `${temp}/test.md`

  await $.copy_(source, temp, 'test.md')
  if (!await $.isExisted_(target)) throw new Error('0')

  const listCont = [
    await $.read_(source),
    await $.read_(target),
  ]
  if (listCont[0] !== listCont[1]) throw new Error('1')
}

async function b_(): Promise<void> {

  const source = './license.md'
  const target = `${temp}/new/license.md`

  await $.copy_(source, `${temp}/new`)
  if (!await $.isExisted_(target)) throw new Error('0')

  const listCont = [
    await $.read_(source),
    await $.read_(target),
  ]
  if (listCont[0] !== listCont[1]) throw new Error('1')
}

async function c_(): Promise<void> {

  if (!$.os('macos')) return
  const source = './license.md'
  const target = '~/Downloads/temp/license.md'

  await $.copy_(source, '~/Downloads/temp')
  if (!await $.isExisted_(target)) throw new Error('0')

  const listCont = [
    await $.read_(source),
    await $.read_(target),
  ]
  if (listCont[0] !== listCont[1]) throw new Error('1')

  await $.remove_('~/Downloads/temp')
}

async function d_(): Promise<void> {

  const source = `${temp}/a.txt`
  const target = `${temp}/b.txt`
  const content = 'a little message'
  await $.write_(source, content)

  await $.copy_(source, '', 'b.txt')
  if (!await $.isExisted_(target)) throw new Error('0')

  const cont = await $.read_(target)
  if (cont !== content) throw new Error('1')
}

// export
export {
  a_,
  b_,
  c_,
  d_,
}
