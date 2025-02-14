/**
 * Convert input to Date object
 * @param input Date | number | string
 * @returns Date
 * @throws Error
 * @example
 * ```
 * console.log(toDate(new Date(0)))
 * //=> 1970-01-01T00:00:00.000Z
 * ```
 */
const toDate = (input: Date | number | string) => {
  const result = (() => {
    if (input instanceof Date) return new Date(input)
    if (typeof input === 'number') return new Date(input)
    if (typeof input === 'string') {
      // 1. 尝试解析 ISO 格式字符串
      if (input.includes('T')) {
        const date = new Date(input)
        if (!isNaN(date.getTime())) return date
      }

      // 2. 尝试直接解析
      const date = new Date(input)
      if (!isNaN(date.getTime())) return date

      // 3. 最后尝试替换连字符的方式
      return new Date(input.replace(/-/g, '/'))
    }
    throw new Error('invalid input')
  })()

  if (result > new Date(0)) return result
  throw new Error('invalid input')
}

export default toDate
