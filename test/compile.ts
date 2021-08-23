/* eslint-disable no-await-in-loop */
import { $, temp } from './index'

// function

const a = async () => {

  const source = `${temp}/test.coffee`
  const target = `${temp}/test.js`
  const content = 'console.log 123'
  await $.write(source, content)
  await $.compile(source, {
    bare: true,
    sourcemaps: true,
  })

  if (!await $.isExisted(target)) throw new Error('0')

  const cont = (await $.read<string>(target))
  $.i(cont)
  if (cont.startsWith('(function()')) throw new Error('1')
  if (!cont.includes('sourceMappingURL=')) throw new Error('2')
}
a.description = '.coffee, as { bare: true, sourcemaps: true }'

const b = async () => {

  const source = `${temp}/test.ts`
  const target = `${temp}/test.js`
  const content = 'console.log(123)'
  await $.write(source, content)
  await $.compile(source)

  if (!await $.isExisted(target)) throw new Error('0')

  const cont = (await $.read<string>(target))
  $.i(cont)
  if (cont.includes('sourceMappingURL=')) throw new Error('1')
}
b.description = '.ts'

const c = async () => {

  const source = `${temp}/test.md`
  const target = `${temp}/test.html`
  const content = '# title'
  await $.write(source, content)
  await $.compile(source)

  if (!await $.isExisted(target)) throw new Error('0')

  const cont = await $.read(target)
  $.i(cont)
}
c.description = '.md'

const d = async () => {

  const source = `${temp}/test.yaml`
  const target = `${temp}/test.json`
  const content = '- value: 123'
  await $.write(source, content)
  await $.compile(source)

  if (!await $.isExisted(target)) throw new Error('0')

  const cont = await $.read(target)
  $.i(cont)
}
d.description = '.yaml'

const e = async () => {

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
    await $.write(source, content)
  await $.compile(`${temp}/source/**/*.md`, `${temp}/build`)

  if (!await $.isExisted(listTarget)) throw new Error('0')
}

const f = async () => {

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
    await $.write(source, content)
  await $.compile(listSource)

  if (!await $.isExisted(listTarget)) throw new Error('0')
}

// export
export { a, b, c, d, e, f }
