import type from './type'

// interface

type ObjectX = {
  [key: string]: unknown
}

// function

function main(
  input: unknown
): unknown[] | ObjectX {

  if (typeof input === 'string') return JSON.parse(input)
  if (input instanceof Array) return input
  if (input instanceof Uint8Array) return JSON.parse(input.toString())
  const _type = type(input)
  if (_type === 'object') return input as ObjectX
  throw new Error(`parseJson/error: invalid type '${_type}'`)
}

// export
export default main
