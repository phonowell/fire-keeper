import { $, temp } from './index'

const a = async () => {
  const source = `${temp}/a.txt`
  const content = 'a little message'
  await $.write(source, content)

  if ((await $.read<string>(source)) !== content)
    throw new Error('text content mismatch')
}
a.description = 'text file'

const b = async () => {
  const source = `${temp}/b.json`
  const message = 'a little message'
  const content = { message }
  await $.write(source, content)

  if ((await $.read<{ message: string }>(source))?.message !== message)
    throw new Error('json content mismatch')
}
b.description = 'json file'

const c = async () => {
  const source = `${temp}/c.txt`
  if (await $.read(source))
    throw new Error('non-existent file should return undefined')
}
c.description = 'non-existent file'

const d = async () => {
  const source = `${temp}/d.txt`
  const content = 'a little message'
  await $.write(source, content)

  const raw = await $.read(source, { raw: true })
  if (!(raw instanceof Uint8Array))
    throw new Error('raw option should return Buffer')

  const cont = raw.toString()
  if (cont !== content) throw new Error('raw content mismatch')
}
d.description = 'raw buffer'

const e = async () => {
  const source = `${temp}/e.yaml`
  const content = 'a little message'
  await $.write(source, `- value: ${content}`)

  const cont = await $.read<[{ value: string }]>(source)
  if (cont?.[0].value !== content) throw new Error('yaml content mismatch')
}
e.description = 'yaml file'

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
    const source = `${temp}/test${ext}`
    await $.write(source, content)
    const result = await $.read<string>(source)
    if (result !== content) throw new Error(`${ext} content mismatch`)
  }
}
f.description = 'supported extensions'

const g = async () => {
  const source = `${temp}/test.yml`
  const content = {
    string: 'test',
    number: 42,
    boolean: true,
    array: [1, 2, 3],
    nested: { key: 'value' },
  }
  await $.write(
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

  const result = await $.read<typeof content>(source)
  if (JSON.stringify(result) !== JSON.stringify(content))
    throw new Error('complex yaml parsing failed')
}
g.description = 'complex yaml'

const h = async () => {
  // Test invalid JSON
  const source = `${temp}/invalid.json`
  await $.write(source, '{ invalid: json }')

  try {
    await $.read(source)
    throw new Error('should throw on invalid json')
  } catch (error) {
    if (!(error instanceof Error)) throw new Error('unexpected error type')
    if (!error.message.includes('JSON')) throw new Error('wrong error message')
  }
}
h.description = 'invalid json'

const i = async () => {
  // Test invalid YAML
  const source = `${temp}/invalid.yaml`
  await $.write(source, 'key: [invalid yaml')

  try {
    await $.read(source)
    throw new Error('should throw on invalid yaml')
  } catch (error) {
    if (!(error instanceof Error)) throw new Error('unexpected error type')
  }
}
i.description = 'invalid yaml'

const j = async () => {
  // Test different encodings
  const source = `${temp}/encoded.txt`
  const content = '你好，世界' // Chinese characters
  await $.write(source, content)

  const result = await $.read<string>(source)
  if (result !== content) throw new Error('utf8 encoding failed')
}
j.description = 'text encoding'

const k = async () => {
  // Test large file
  const source = `${temp}/large.txt`
  const content = 'x'.repeat(1024 * 1024) // 1MB
  await $.write(source, content)

  const result = await $.read<string>(source)
  if (result !== content) throw new Error('large file content mismatch')
}
k.description = 'large file'

const l = async () => {
  // Test different line endings
  const source = `${temp}/lines.txt`
  const content = 'line1\r\nline2\nline3'
  await $.write(source, content)

  const result = await $.read<string>(source)
  if (result !== content) throw new Error('line endings mismatch')
}
l.description = 'line endings'

export { a, b, c, d, e, f, g, h, i, j, k, l }
