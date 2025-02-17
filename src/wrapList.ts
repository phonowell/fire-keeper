import toArray from './toArray'

/**
 * Wrap list.
 * @param input The input.
 * @returns The wrapped list.
 * @example
 * ```
 * wrapList([1, 2, 3])
 * //=> '1, 2, 3'
 *
 * wrapList(123)
 * //=> '123'
 * ```
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
