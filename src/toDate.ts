/**
 * Convert input to Date object. Handles various formats and validates results.
 * @param input - Date object, timestamp (number), or date string
 * @returns A valid Date object after 1970-01-01
 * @throws Error when input is invalid or results in date before epoch
 * @example
 * ```
 * toDate(new Date())        // Current date
 * toDate(1640995200000)     // 2022-01-01
 * toDate('2021-01-01')      // Hyphenated format
 * toDate('2021/01/01')      // Slash format
 * toDate('2021-01-01T12:00:00Z') // ISO format
 * ```
 */
const toDate = (input: Date | number | string) => {
  const result = (() => {
    if (input instanceof Date) return new Date(input)
    if (typeof input === 'number') return new Date(input)

    if (typeof input === 'string') {
      // 尝试解析 ISO 格式字符串
      if (input.includes('T')) {
        const date = new Date(input)
        if (!isNaN(date.getTime())) return date
      }

      // 尝试直接解析
      const date = new Date(input)
      if (!isNaN(date.getTime())) return date

      // 最后尝试替换连字符的方式
      return new Date(input.replace(/-/g, '/'))
    }

    throw new Error('invalid input')
  })()

  if (isNaN(result.getTime()) || result <= new Date(0))
    throw new Error('invalid input')

  return result
}

export default toDate
