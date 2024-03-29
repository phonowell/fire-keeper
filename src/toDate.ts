// function

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
    if (typeof input === 'string') return new Date(input.replace(/-/g, '/'))
    throw new Error('invalid input')
  })()
  if (result > new Date(0)) return result
  throw new Error('invalid input')
}

// export
export default toDate
