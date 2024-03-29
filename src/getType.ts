// function

/**
 * Get the type of the input value.
 * @deprecated Use `typeof` instead.
 * @param input The input value.
 * @returns The type of the input value.
 * @example
 * ```
 * const type = getType('hello')
 * //=> 'string'
 * ```
 */
const getType = (input: unknown) => {
  const type = Object.prototype.toString
    .call(input)
    .replace(/^\[object (.+)\]$/, '$1')
    .toLowerCase()

  return type === 'asyncfunction' ? 'function' : type
}

// export
export default getType
