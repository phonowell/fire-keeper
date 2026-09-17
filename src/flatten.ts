/**
 * Flatten nested arrays recursively into a single level
 * @template T - Element type
 * @param array - Nested array structure to flatten
 * @returns Single-level array with preserved order
 * @example
 * flatten([1, [2, [3]], 4]) // [1, 2, 3, 4]
 */
const flatten = <T>(array: (T | T[])[]): T[] => array.flat(Number.POSITIVE_INFINITY) as T[]

export default flatten
