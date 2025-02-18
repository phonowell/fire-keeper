import { isExist, write, zip } from '../src'

import { cleanup, TEMP } from '.'

const setup = async () => {
  // Clean previous files
  await cleanup()

  // Create test files
  await write(`${TEMP}/a.txt`, 'content a')
  await write(`${TEMP}/b.txt`, 'content b')
  await write(`${TEMP}/sub/c.txt`, 'content c')
}

const a = async () => {
  await setup()
  await zip(`${TEMP}/a.txt`, TEMP, 'single.zip')
  if (!(await isExist(`${TEMP}/single.zip`))) throw new Error('Zip failed')
  await cleanup()
}
a.description = 'zips a single file'

const b = async () => {
  await setup()
  await zip([`${TEMP}/a.txt`, `${TEMP}/b.txt`], TEMP, 'multiple.zip')
  if (!(await isExist(`${TEMP}/multiple.zip`))) throw new Error('Zip failed')
  await cleanup()
}
b.description = 'zips multiple files'

const c = async () => {
  await setup()
  await zip(`${TEMP}/*.txt`, TEMP, 'wild.zip')
  if (!(await isExist(`${TEMP}/wild.zip`))) throw new Error('Zip failed')
  await cleanup()
}
c.description = 'zips using wildcard pattern'

const d = async () => {
  await setup()
  await zip(`${TEMP}/**/*.txt`, TEMP, 'wild-recursive.zip')
  if (!(await isExist(`${TEMP}/wild-recursive.zip`)))
    throw new Error('Zip failed')
  await cleanup()
}
d.description = 'uses wildcard base path correctly'

const e = async () => {
  await setup()
  await zip(`${TEMP}/sub/c.txt`, TEMP, {
    base: `${TEMP}/sub`,
    filename: 'base.zip',
  })
  if (!(await isExist(`${TEMP}/base.zip`))) throw new Error('Zip failed')
  await cleanup()
}
e.description = 'uses custom base directory'

const f = async () => {
  await setup()
  await zip(`${TEMP}/a.txt`)
  if (!(await isExist(`${TEMP}/temp.zip`))) throw new Error('Zip failed')
  await cleanup()
}
f.description = 'uses default target directory'

const g = async () => {
  await setup()
  await zip(`${TEMP}/a.txt`, TEMP)
  if (!(await isExist(`${TEMP}/temp.zip`))) throw new Error('Zip failed')
  await cleanup()
}
g.description = 'uses default filename'

const h = async () => {
  await setup()
  await zip(`${TEMP}/a.txt`, TEMP, { filename: 'custom.zip' })
  if (!(await isExist(`${TEMP}/custom.zip`))) throw new Error('Zip failed')
  await cleanup()
}
h.description = 'handles custom options'

const i = async () => {
  await setup()
  await zip(`${TEMP}/a.txt`, TEMP, '')
  if (!(await isExist(`${TEMP}/temp.zip`))) throw new Error('Zip failed')
  await cleanup()
}
i.description = 'handles empty option string'

const j = async () => {
  await setup()
  let errorThrown = false
  try {
    await zip([], TEMP)
  } catch {
    errorThrown = true
  }
  if (!errorThrown) throw new Error('Expected error was not thrown')
  await cleanup()
}
j.description = 'fails on empty source list'

const k = async () => {
  await setup()
  await zip(`${TEMP}/nonexistent.txt`, TEMP, 'empty.zip')
  if (!(await isExist(`${TEMP}/empty.zip`))) throw new Error('Zip failed')
  await cleanup()
}
k.description = 'returns successfully for nonexistent files'

const l = async () => {
  await setup()
  await zip(`${TEMP}/no-matches-*.txt`, TEMP, 'no-matches.zip')
  if (!(await isExist(`${TEMP}/no-matches.zip`))) throw new Error('Zip failed')
  await cleanup()
}
l.description = 'handles glob with no matches'

export { a, b, c, d, e, f, g, h, i, j, k, l }
