import { get } from 'radash'

type PathType<T, P> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PathType<T[K], R>
    : undefined
  : P extends keyof T
    ? T[P]
    : undefined

type DeepKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${DeepKeyOf<T[K]>}`
          : K
        : never
    }[keyof T]
  : never

type SplitPath<P extends string> = P extends `${infer F}.${infer R}`
  ? [F, ...SplitPath<R>]
  : [P]

type PathValue<T, P extends string[]> = P extends [
  infer F extends string,
  ...infer R,
]
  ? F extends `${infer Head}.${infer Rest}`
    ? Head extends keyof T
      ? PathValue<
          T[Head],
          [...SplitPath<Rest>, ...(R extends string[] ? R : [])]
        >
      : undefined
    : F extends keyof T
      ? R extends string[]
        ? PathValue<T[F], R>
        : T[F]
      : undefined
  : T

type AtFn = {
  <T extends unknown[], N extends number>(input: T, index: N): T[N] | undefined
  <T extends Record<string, unknown>, P extends DeepKeyOf<T>>(
    input: T,
    path: P,
  ): PathType<T, P> | undefined
  <T extends Record<string, unknown>, P extends string[]>(
    input: T,
    ...paths: P
  ): PathValue<T, P> | undefined
}

/**
 * Safely access nested properties in objects or arrays using path strings or indices.
 * Supports both array indexing (including negative indices) and object property access.
 * Returns undefined if any part of the path is invalid.
 *
 * @template T - The expected type of the returned value
 * @param {unknown[] | Record<string, unknown>} input - The object or array to access
 * @param {...(string | number)} paths - Path segments to the desired value. Can be:
 *   - Array indices (numbers, including negative)
 *   - Object property names
 *   - Dot-notation strings (e.g., "a.b.c")
 *   - Mixed formats (e.g., "a.b", "c", "d" or "a", "b.c.d")
 * @returns {T | undefined} The value at the specified path, or undefined if not found.
 * Special values like null, undefined, and NaN are preserved as-is.
 *
 * @example
 * ```typescript
 * // Array access (positive and negative indices)
 * const arr = [1, 2, 3]
 * at(arr, 1)    // 2
 * at(arr, -1)   // 3 (last element)
 *
 * // Object property access
 * const obj = { a: { b: { c: 1 } } }
 * at(obj, 'a', 'b', 'c')  // 1
 * at(obj, 'a.b.c')        // 1 (dot notation)
 * at(obj, 'x.y.z')        // undefined (safe access)
 *
 * // Mixed access styles
 * at(obj, 'a.b', 'c')     // 1
 * at(obj, 'a', 'b.c')     // 1
 *
 * // Special values
 * const special = { a: null, b: undefined, c: NaN }
 * at(special, 'a')        // null
 * at(special, 'b')        // undefined
 * at(special, 'c')        // NaN
 *
 * // Mixed access with type preservation
 * interface User {
 *   friends: { name: string }[]
 * }
 * const user: User = {
 *   friends: [{ name: 'Alice' }, { name: 'Bob' }]
 * }
 * at<string>(user, 'friends', 0, 'name')  // 'Alice'
 * at(user, 'friends.1.name')              // 'Bob'
 * ```
 */
const at: AtFn = (
  input: unknown[] | Record<string, unknown>,
  ...paths: (string | number)[]
): unknown | undefined => {
  if (Array.isArray(input)) {
    const index = paths[0] as number
    return index < 0 ? input[input.length + index] : input[index]
  }

  const path =
    paths.length === 1
      ? String(paths[0])
      : paths.map(String).join('.').split('.').filter(Boolean).join('.')

  return get(input, path)
}

export default at
