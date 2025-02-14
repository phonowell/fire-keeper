import { Buffer } from 'buffer'

import { $, temp } from './index'

const a = async () => {
  const source = `${temp}/wr/ite.txt`
  const content = 'a little message'
  await $.write(source, content)

  if ((await $.read<string>(source)) !== content)
    throw new Error('string content mismatch')
}
a.description = 'string content'

const b = async () => {
  const source = `${temp}/wr/ite.json`
  const message = 'a little message'
  const content = { message }
  await $.write(source, content)

  const cont = await $.read<{ message: string }>(source)
  if (cont?.message !== message) throw new Error('object content mismatch')
}
b.description = 'object content'

const c = async () => {
  // Test Buffer input
  const source = `${temp}/buffer.txt`
  const content = Buffer.from('buffer content')
  await $.write(source, content)

  const result = await $.read<string>(source)
  if (result !== content.toString()) throw new Error('buffer content mismatch')
}
c.description = 'buffer input'

const e = async () => {
  // Test ArrayBuffer/TypedArray
  const source = `${temp}/typed-array.txt`
  const encoder = new TextEncoder()
  const content = encoder.encode('typed array content')
  await $.write(source, content)

  const result = await $.read<string>(source)
  if (result !== 'typed array content')
    throw new Error('typed array content mismatch')
}
e.description = 'typed array'

const g = async () => {
  // Test Blob
  const source = `${temp}/blob.txt`
  const content = 'blob content'
  const blob = new Blob([content], { type: 'text/plain' })
  await $.write(source, blob)

  const result = await $.read<string>(source)
  if (result !== content) throw new Error('blob content mismatch')
}
g.description = 'blob input'

const h = async () => {
  // Test primitive types
  const source = `${temp}/primitive.txt`
  const testCases = [
    [42, '42'],
    [true, 'true'],
    [null, 'null'],
    [undefined, 'undefined'],
  ]

  for (const [input, expected] of testCases) {
    await $.write(source, input)
    const result = await $.read<string>(source)
    if (result !== expected)
      throw new Error(`primitive ${String(input)} content mismatch`)
  }
}
h.description = 'primitive types'

const i = async () => {
  // Test path normalization
  const source = `${temp}/./normalize/../normalize/test.txt`
  const normalizedPath = `${temp}/normalize/test.txt`
  const content = 'normalized path test'

  await $.write(source, content)

  const exists = await $.isExist(normalizedPath)
  if (!exists) throw new Error('normalized path not created')

  const result = await $.read<string>(normalizedPath)
  if (result !== content) throw new Error('normalized path content mismatch')
}
i.description = 'path normalization'

const j = async () => {
  // Test write options (mode, encoding, etc)
  const source = `${temp}/options.txt`
  const content = 'test with options'

  await $.write(source, content, {
    encoding: 'utf8',
    mode: 0o666,
    flag: 'w',
  })

  const result = await $.read<string>(source)
  if (result !== content) throw new Error('content with options mismatch')
}
j.description = 'write options'

export { a, b, c, e, g, h, i, j }
