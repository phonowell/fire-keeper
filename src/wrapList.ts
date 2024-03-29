import toArray from './toArray'
import toString from './toString'

// function

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
  input
    ? toArray(input)
        .map(it => `'${toString(it)}'`)
        .join(', ')
    : ''

// export
export default wrapList
