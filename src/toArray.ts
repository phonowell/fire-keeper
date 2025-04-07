/**
 * Convert any value to an array. If the input is already an array, returns it unchanged.
 * Otherwise wraps the input in an array. Preserves type information and handles special cases.
 *
 * @template T - The type of elements in the array
 * @param {T | T[]} input - The value to convert to an array
 * @returns {T[]} An array containing the input value, or the input array itself
 *
 * @example
 * // Basic types
 * toArray(42)                    // [42]
 * toArray('hello')              // ['hello']
 * toArray(true)                 // [true]
 * toArray(null)                 // [null]
 * toArray(undefined)            // [undefined]
 * toArray(Symbol('test'))       // [Symbol('test')]
 * toArray(BigInt(Number.MAX_SAFE_INTEGER))  // [9007199254740991n]
 *
 * // Arrays pass through unchanged
 * toArray([1, 2, 3])           // [1, 2, 3]
 * toArray([])                   // []
 *
 * // Objects and complex types
 * const obj = { key: 'value' }
 * toArray(obj)                  // [{ key: 'value' }]
 *
 * // Class instances (preserves instanceof)
 * class TestClass {
 *   constructor(public value: string) {}
 * }
 * toArray(new TestClass('test'))  // [TestClass{ value: 'test' }]
 *
 * // Built-in objects
 * toArray(new Set([1, 2, 3]))    // [Set(3)]
 * toArray(new Map([['a', 1]]))    // [Map(1)]
 *
 * // Type preservation
 * type Config = { port: number }
 * const config: Config = { port: 3000 }
 * const configs = toArray(config)  // Config[]
 */
const toArray = <T>(input: T | T[]): T[] =>
  Array.isArray(input) ? input : [input]

export default toArray
