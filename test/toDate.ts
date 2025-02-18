import { toDate } from '../src'

const a = () => {
  // Test string input with hyphens
  const string = '2021-1-1'
  const result = toDate(string)
  if (result.getTime() !== new Date('2021/1/1').getTime())
    throw new Error('hyphenated string input failed')
}
a.description = 'string with hyphens'

const b = () => {
  // Test Date object input
  const input = new Date('2023-12-25')
  const result = toDate(input)
  if (result.getTime() !== input.getTime())
    throw new Error('Date object input failed')
}
b.description = 'Date object'

const c = () => {
  // Test numeric timestamp input
  const timestamp = 1640995200000 // 2022-01-01
  const result = toDate(timestamp)
  if (result.getTime() !== timestamp) throw new Error('timestamp input failed')
}
c.description = 'numeric timestamp'

const d = () => {
  // Test string without hyphens
  const string = '2021/1/1'
  const result = toDate(string)
  if (result.getTime() !== new Date(string).getTime())
    throw new Error('non-hyphenated string input failed')
}
d.description = 'string without hyphens'

const e = () => {
  // Test invalid date string
  try {
    toDate('invalid-date')
    throw new Error('should throw on invalid date string')
  } catch (error: unknown) {
    if (!(error instanceof Error) || !error.message.includes('invalid input')) {
      throw new Error('wrong error for invalid date string')
    }
  }
}
e.description = 'invalid date string'

const f = () => {
  // Test pre-epoch date
  try {
    toDate('1969-12-31')
    throw new Error('should throw on pre-epoch date')
  } catch (error: unknown) {
    if (!(error instanceof Error) || !error.message.includes('invalid input')) {
      throw new Error('wrong error for pre-epoch date')
    }
  }
}
f.description = 'pre-epoch date'

const g = () => {
  // Test invalid input type
  try {
    // @ts-expect-error Testing invalid input type
    toDate({})
    throw new Error('should throw on invalid input type')
  } catch (error: unknown) {
    if (!(error instanceof Error) || !error.message.includes('invalid input')) {
      throw new Error('wrong error for invalid input type')
    }
  }
}
g.description = 'invalid input type'

const h = () => {
  // Test ISO string format
  const isoString = '2024-02-14T12:00:00.000Z'
  const result = toDate(isoString)
  if (result.toISOString() !== isoString)
    throw new Error('ISO string format failed')
}
h.description = 'ISO string format'

export { a, b, c, d, e, f, g, h }
