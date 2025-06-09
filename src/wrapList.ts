import toArray from './toArray.js'

/**
 * Converts input to a comma-separated string with each item wrapped in single quotes.
 * @param input Any value (primitives, arrays, objects)
 * @returns A string with items wrapped in quotes and joined with commas
 * @example
 * // Arrays of primitives
 * wrapList(['a', 'b', 'c'])
 * //=> "'a', 'b', 'c'"
 *
 * // Single values are also processed
 * wrapList(123)
 * //=> "'123'"
 *
 * // Objects are JSON stringified
 * wrapList({name: 'test'})
 * //=> "'{"name":"test"}'"
 *
 * // Null and undefined become empty strings
 * wrapList([null, undefined])
 * //=> ", "
 */
const wrapList = (input: unknown) =>
  toArray(input)
    .map((it): string => {
      if (it === null) return ''
      if (it === undefined) return ''

      if (
        typeof it === 'string' ||
        typeof it === 'number' ||
        typeof it === 'boolean'
      )
        return `'${it}'`

      return `'${JSON.stringify(it)}'`
    })
    .join(', ')

export default wrapList
