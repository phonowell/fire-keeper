import { read, remove, write } from '../src/index.js'

import { TEMP } from './index.js'

const a = async () => {
  const source = `${TEMP}/a.txt`
  const content = 'a little message'
  await write(source, content)

  if ((await read<string>(source)) !== content)
    throw new Error('text content mismatch')
}
a.description = 'reads text file'

const b = async () => {
  const source = `${TEMP}/b.json`
  const message = 'a little message'
  const content = { message }
  await write(source, content)

  if ((await read<{ message: string }>(source))?.message !== message)
    throw new Error('json content mismatch')
}
b.description = 'reads json file'

const c = async () => {
  const source = `${TEMP}/c.txt`
  if (await read(source))
    throw new Error('non-existent file should return undefined')
}
c.description = 'handles non-existent file'

const d = async () => {
  const source = `${TEMP}/d.txt`
  const content = 'a little message'
  await write(source, content)

  const raw = await read(source, { raw: true })
  if (!(raw instanceof Uint8Array))
    throw new Error('raw option should return Buffer')

  const result = raw.toString()
  if (result !== content) throw new Error('raw content mismatch')
}
d.description = 'reads raw buffer'

const e = async () => {
  const source = `${TEMP}/e.yaml`
  const content = 'a little message'
  await write(source, `- value: ${content}`)

  const result = await read<[{ value: string }]>(source)
  if (result?.[0].value !== content) throw new Error('yaml content mismatch')
}
e.description = 'reads yaml file'

const f = async () => {
  // Test all supported file extensions
  const extensions = [
    '.coffee',
    '.css',
    '.html',
    '.js',
    '.md',
    '.pug',
    '.sh',
    '.styl',
    '.ts',
    '.tsx',
    '.txt',
    '.xml',
  ]
  const content = 'test content'

  for (const ext of extensions) {
    const source = `${TEMP}/test${ext}`
    await write(source, content)
    const result = await read<string>(source)
    if (result !== content) throw new Error(`${ext} content mismatch`)
  }
}
f.description = 'reads supported extensions'

const g = async () => {
  const source = `${TEMP}/test.yml`
  const content = {
    string: 'test',
    number: 42,
    boolean: true,
    array: [1, 2, 3],
    nested: { key: 'value' },
  }
  await write(
    source,
    `
string: test
number: 42
boolean: true
array:
  - 1
  - 2
  - 3
nested:
  key: value
`,
  )

  const result = await read<typeof content>(source)
  if (JSON.stringify(result) !== JSON.stringify(content))
    throw new Error('complex yaml parsing failed')
}
g.description = 'reads complex yaml'

const h = async () => {
  // Test binary file
  const source = `${TEMP}/binary.bin`
  const content = Buffer.from([0x00, 0x01, 0x02, 0x03])
  await write(source, content)

  const result = await read(source, { raw: true })
  if (!result || !(result instanceof Uint8Array))
    throw new Error('binary read type failed')
  if (!content.equals(result)) throw new Error('binary content mismatch')
}
h.description = 'reads binary file'

const i = async () => {
  // Test concurrent reads
  const sources = [
    { path: `${TEMP}/concurrent1.txt`, content: 'content1' },
    { path: `${TEMP}/concurrent2.txt`, content: 'content2' },
    { path: `${TEMP}/concurrent3.txt`, content: 'content3' },
  ]

  await Promise.all(sources.map((s) => write(s.path, s.content)))
  const results = await Promise.all(sources.map((s) => read<string>(s.path)))

  for (let i = 0; i < sources.length; i++) {
    if (results[i] !== sources[i].content)
      throw new Error(`concurrent read ${i + 1} failed`)
  }
}
i.description = 'supports concurrent reads'

const j = async () => {
  // Test empty files
  const source = `${TEMP}/empty.txt`
  await write(source, '')

  const textResult = await read<string>(source)
  if (textResult !== '') throw new Error('empty text read failed')

  const rawResult = await read(source, { raw: true })
  if (!rawResult || rawResult.length !== 0)
    throw new Error('empty raw read failed')
}
j.description = 'handles empty files'

const k = async () => {
  // Test Windows-style line endings
  const source = `${TEMP}/windows.txt`
  const content = 'line1\r\nline2\r\nline3'
  await write(source, content)

  const result = await read<string>(source)
  if (result !== content) throw new Error('windows line endings failed')

  const lines = result.split('\r\n')
  if (lines.length !== 3) throw new Error('line splitting failed')
}
k.description = 'preserves line endings'

const l = async () => {
  // Test read timing after write
  const source = `${TEMP}/timing.txt`
  const content = 'timing test'

  await write(source, content)
  // Immediately try to read
  const result = await read<string>(source)

  if (result !== content) throw new Error('read after write failed')
}
l.description = 'handles read timing'

// Cleanup helper
const cleanup = async () => {
  await remove([
    `${TEMP}/a.txt`,
    `${TEMP}/b.json`,
    `${TEMP}/d.txt`,
    `${TEMP}/e.yaml`,
    `${TEMP}/test.yml`,
    `${TEMP}/binary.bin`,
    `${TEMP}/empty.txt`,
    `${TEMP}/windows.txt`,
    `${TEMP}/timing.txt`,
    `${TEMP}/concurrent1.txt`,
    `${TEMP}/concurrent2.txt`,
    `${TEMP}/concurrent3.txt`,
    ...[
      '.coffee',
      '.css',
      '.html',
      '.js',
      '.md',
      '.pug',
      '.sh',
      '.styl',
      '.ts',
      '.tsx',
      '.txt',
      '.xml',
    ].map((ext) => `${TEMP}/test${ext}`),
  ])
}

export { a, b, c, d, e, f, g, h, i, j, k, l, cleanup }
