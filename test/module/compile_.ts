/* eslint-disable no-await-in-loop */
import { $, temp } from '..'

// function

async function a_(): Promise<void> {

  const source = `${temp}/test.coffee`
  const target = `${temp}/test.js`
  const content = 'console.log 123'
  await $.write_(source, content)
  await $.compile_(source, {
    bare: true,
    sourcemaps: true,
  })

  if (!await $.isExisted_(target)) throw new Error('0')

  const cont = (await $.read_(target)) as string
  $.i(cont)
  if (cont.startsWith('(function()')) throw new Error('1')
  if (!cont.includes('sourceMappingURL=')) throw new Error('2')
}
a_.description = '.coffee, as { bare: true, sourcemaps: true }'

async function b_(): Promise<void> {

  const source = `${temp}/test.ts`
  const target = `${temp}/test.js`
  const content = 'console.log(123)'
  await $.write_(source, content)
  await $.compile_(source)

  if (!await $.isExisted_(target)) throw new Error('0')

  const cont = (await $.read_(target)) as string
  $.i(cont)
  if (cont.includes('sourceMappingURL=')) throw new Error('1')
}
b_.description = '.ts'

async function c_(): Promise<void> {

  const source = `${temp}/test.md`
  const target = `${temp}/test.html`
  const content = '# title'
  await $.write_(source, content)
  await $.compile_(source)

  if (!await $.isExisted_(target)) throw new Error('0')

  const cont = await $.read_(target)
  $.i(cont)
}
c_.description = '.md'

async function d_(): Promise<void> {

  const source = `${temp}/test.yaml`
  const target = `${temp}/test.json`
  const content = '- value: 123'
  await $.write_(source, content)
  await $.compile_(source)

  if (!await $.isExisted_(target)) throw new Error('0')

  const cont = await $.read_(target)
  $.i(cont)
}
d_.description = '.yaml'

async function e_(): Promise<void> {

  const listSource = [
    `${temp}/source/a.md`,
    `${temp}/source/b/b.md`,
    `${temp}/source/b/c/c.md`,
  ]
  const listTarget = [
    `${temp}/build/a.html`,
    `${temp}/build/b/b.html`,
    `${temp}/build/b/c/c.html`,
  ]
  const content = '# test'
  for (const source of listSource)
    await $.write_(source, content)
  await $.compile_(`${temp}/source/**/*.md`, `${temp}/build`)

  if (!await $.isExisted_(listTarget)) throw new Error('0')
}

async function f_(): Promise<void> {

  const listSource = [
    `${temp}/a.ts`,
    `${temp}/b/b.ts`,
    `${temp}/c/c/c.ts`,
  ]
  const listTarget = [
    `${temp}/a.js`,
    `${temp}/b/b.js`,
    `${temp}/c/c/c.js`,
    `${temp}/a.d.ts`,
    `${temp}/b/b.d.ts`,
    `${temp}/c/c/c.d.ts`,
  ]
  const content = 'alert(1)'
  for (const source of listSource)
    await $.write_(source, content)
  await $.compile_(listSource)

  if (!await $.isExisted_(listTarget)) throw new Error('0')
}

// export
export {
  a_,
  b_,
  c_,
  d_,
  e_,
  f_,
}
