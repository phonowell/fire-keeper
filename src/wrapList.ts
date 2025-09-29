import toArray from './toArray.js'

/**
 * Convert values to comma-separated quoted string
 * @param input - Any value (primitives, arrays, objects)
 * @returns String with items wrapped in quotes and joined with commas
 * @example
 * wrapList(['a', 'b'])     // "'a', 'b'"
 * wrapList(123)            // "'123'"
 * wrapList({key: 'val'})   // "'{"key":"val"}'"
 */
const wrapList = (input: unknown) =>
  toArray(input)
    .map((it): string => {
      if (it === null || it === undefined) return ''

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
