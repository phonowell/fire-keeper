import { $, temp } from './index'

const a = async () => {
  const source = './license.md'
  const target = `${temp}/test.md`

  await $.copy(source, temp, 'test.md')
  if (!(await $.isExist(target))) throw new Error('0')
  if (!(await $.isSame(source, target))) throw new Error('1')
}
a.description = 'copy with explicit target and name'

const b = async () => {
  const source = './license.md'
  const target = `${temp}/new/license.md`

  await $.copy(source, `${temp}/new`)
  if (!(await $.isExist(target))) throw new Error('0')
  if (!(await $.isSame(source, target))) throw new Error('1')
}
b.description = 'copy with target directory only'

const c = async () => {
  if ($.os() !== 'macos') return
  const source = './license.md'
  const target = '~/Downloads/temp/license.md'

  await $.copy(source, '~/Downloads/temp')
  if (!(await $.isExist(target))) throw new Error('0')
  if (!(await $.isSame(source, target))) throw new Error('1')
}
c.description = 'copy to home directory path'

const d = async () => {
  const source = `${temp}/a.txt`
  const target = `${temp}/b.txt`
  const content = 'a little message'
  await $.write(source, content)

  await $.copy(source, '', 'b.txt')
  if (!(await $.isSame(source, target))) throw new Error('0')
}
d.description = 'copy with empty target directory'

const e = async () => {
  // Test default copy name in same directory
  const source = `${temp}/original.txt`
  await $.write(source, 'content')
  await $.copy(source)

  const copiedFile = `${temp}/original.copy.txt`
  if (!(await $.isExist(copiedFile))) throw new Error('0')
  if (!(await $.isSame(source, copiedFile))) throw new Error('1')
}
e.description = 'default copy name in same directory'

const f = async () => {
  // Test array input
  const sources = [`${temp}/f1.txt`, `${temp}/f2.txt`]
  await Promise.all(sources.map(s => $.write(s, 'content')))

  const targetDir = `${temp}/target`
  await $.copy(sources, targetDir)

  if (!(await $.isExist(`${targetDir}/f1.txt`))) throw new Error('0')
  if (!(await $.isExist(`${targetDir}/f2.txt`))) throw new Error('1')
}
f.description = 'copy array of files'

const g = async () => {
  // Test function target
  const source = `${temp}/g.txt`
  await $.write(source, 'content')

  await $.copy(source, dirname => `${dirname}/func`)
  if (!(await $.isExist(`${temp}/func/g.txt`))) throw new Error('0')
}
g.description = 'copy with function target'

const h = async () => {
  // Test function name with async
  const source = `${temp}/h.txt`
  await $.write(source, 'content')

  await $.copy(source, temp, async name => {
    await $.sleep(10) // small delay
    return `async-${name}`
  })

  if (!(await $.isExist(`${temp}/async-h.txt`))) throw new Error('0')
}
h.description = 'copy with async function name'

export { a, b, c, d, e, f, g, h }
