import { Buffer } from 'buffer'

import { read, write, isExist } from '../src'

import { TEMP } from './index'

const a = async () => {
  const source = `${TEMP}/wr/ite.txt`
  const content = 'a little message'
  await write(source, content)

  if ((await read<string>(source)) !== content)
    throw new Error('string content mismatch')
}
a.description = 'writes string content'

const b = async () => {
  const source = `${TEMP}/wr/ite.json`
  const message = 'a little message'
  const content = { message }
  await write(source, content)

  const result = await read<{ message: string }>(source)
  if (result?.message !== message) throw new Error('object content mismatch')
}
b.description = 'writes object content'

const c = async () => {
  // Test Buffer input
  const source = `${TEMP}/buffer.txt`
  const content = Buffer.from('buffer content')
  await write(source, content)

  const result = await read<string>(source)
  if (result !== content.toString()) throw new Error('buffer content mismatch')
}
c.description = 'writes buffer content'

const d = async () => {
  // Test ArrayBuffer/TypedArray
  const source = `${TEMP}/typed-array.txt`
  const encoder = new TextEncoder()
  const content = encoder.encode('typed array content')
  await write(source, content)

  const result = await read<string>(source)
  if (result !== 'typed array content')
    throw new Error('typed array content mismatch')
}
d.description = 'writes typed array'

const e = async () => {
  // Test Blob
  const source = `${TEMP}/blob.txt`
  const content = 'blob content'
  const blob = new Blob([content], { type: 'text/plain' })
  await write(source, blob)

  const result = await read<string>(source)
  if (result !== content) throw new Error('blob content mismatch')
}
e.description = 'writes blob content'

const f = async () => {
  // Test primitive types
  const source = `${TEMP}/primitive.txt`
  const testCases = [
    [42, '42'],
    [true, 'true'],
    [null, 'null'],
    [undefined, 'undefined'],
    [Symbol('test'), 'Symbol(test)'],
  ]

  for (const [input, expected] of testCases) {
    await write(source, input)
    const result = await read<string>(source)
    if (result !== expected)
      throw new Error(`primitive ${String(input)} content mismatch`)
  }
}
f.description = 'writes primitive types'

const g = async () => {
  // Test path normalization
  const source = `${TEMP}/./normalize/../normalize/test.txt`
  const normalizedPath = `${TEMP}/normalize/test.txt`
  const content = 'normalized path test'

  await write(source, content)

  const exists = await isExist(normalizedPath)
  if (!exists) throw new Error('normalized path not created')

  const result = await read<string>(normalizedPath)
  if (result !== content) throw new Error('normalized path content mismatch')
}
g.description = 'handles path normalization'

const h = async () => {
  // Test large file
  const source = `${TEMP}/large.txt`
  const content = 'x'.repeat(1024 * 1024) // 1MB
  await write(source, content)

  const result = await read<string>(source)
  if (result !== content) throw new Error('large file content mismatch')
}
h.description = 'handles large files'

const i = async () => {
  // Test concurrent writes
  const files = [
    { path: `${TEMP}/concurrent1.txt`, content: 'content1' },
    { path: `${TEMP}/concurrent2.txt`, content: 'content2' },
    { path: `${TEMP}/concurrent3.txt`, content: 'content3' },
  ]

  await Promise.all(files.map(f => write(f.path, f.content)))

  // Verify all writes completed correctly
  for (const file of files) {
    const result = await read<string>(file.path)
    if (result !== file.content)
      throw new Error(`concurrent write failed for ${file.path}`)
  }
}
i.description = 'supports concurrent writes'

const j = async () => {
  // Test special character encoding
  const source = `${TEMP}/special.txt`
  const content = '特殊文字🌟\n\t\r\u0000'
  await write(source, content)

  const result = await read<string>(source)
  if (result !== content) throw new Error('special character encoding failed')
}
j.description = 'handles special characters'

const k = async () => {
  // Test write after write
  const source = `${TEMP}/overwrite.txt`
  await write(source, 'initial content')
  await write(source, 'updated content')

  const result = await read<string>(source)
  if (result !== 'updated content') throw new Error('overwrite failed')
}
k.description = 'handles overwrites'

const l = async () => {
  // Test binary data
  const source = `${TEMP}/binary.dat`
  const content = Buffer.from([0x00, 0xff, 0x80, 0x7f])
  await write(source, content)

  const result = await read(source, { raw: true })
  if (!result || !(result instanceof Uint8Array))
    throw new Error('binary read type failed')
  if (!content.equals(result)) throw new Error('binary content mismatch')
}
l.description = 'writes binary data'

const m = async () => {
  // Test empty content
  const source = `${TEMP}/empty.txt`
  await write(source, '')

  const result = await read<string>(source)
  if (result !== '') throw new Error('empty content failed')
}
m.description = 'handles empty content'

export { a, b, c, d, e, f, g, h, i, j, k, l, m }
