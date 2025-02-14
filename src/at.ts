const asArray = <T>(input: T[], index: number) =>
  input[index < 0 ? input.length + index : index] as T | undefined

const asObject = <T>(input: Record<string, T>, key: string) =>
  input[key] as T | undefined

/**
 * Get the value at the specified index or key.
 * @param input - The input.
 * @param key - The index or key.
 * @returns The value at the specified index or key.
 * @example
 * ```
 * const array = [1, 2, 3]
 * console.log(at(array, 1))
 * //=> 2
 * console.log(at(array, -1))
 * //=> 3
 * console.log(at(array, 3))
 * //=> undefined
 *
 * const object = { a: 1, b: 2, c: 3 }
 * console.log(at(object, 'b'))
 * //=> 2
 * console.log(at(object, 'd'))
 * //=> undefined
 * ```
 */
const at = <T>(input: T[] | Record<string, T>, key: number | string) => {
  if (Array.isArray(input)) return asArray(input, key as number)
  return asObject(input, key as string)
}

export default at
