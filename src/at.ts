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
 * Safely access nested values in arrays or objects
 * @template T - Expected return type
 * @param {unknown[] | Record<string, unknown>} input - Target array or object
 * @param {...(string | number)} paths - Access path as numbers (array indices), strings (object keys), or dot notation
 * @returns {T | undefined} Value at path or undefined if not found
 * @example
 * // Array access (positive/negative indices)
 * at([1, 2, 3], 1)    // 2
 * at([1, 2, 3], -1)   // 3
 *
 * // Object access (key/path)
 * at({a: {b: 1}}, 'a.b')      // 1
 * at({a: {b: 1}}, 'a', 'b')   // 1
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
