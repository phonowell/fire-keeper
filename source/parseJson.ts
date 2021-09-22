import $type from './type'

// interface

type Main = {
  <T>(input: unknown): T
  (input: unknown): unknown[] | ObjectX
}

type ObjectX = {
  [x: string]: unknown
}

// function

const main: Main = (
  input: unknown,
) => {

  if (typeof input === 'string') return JSON.parse(input)
  if (input instanceof Array) return input
  if (input instanceof Uint8Array) return JSON.parse(input.toString())
  const _type = $type(input)
  if (_type === 'object') return input
  throw new Error(`parseJson/error: invalid type '${_type}'`)
}

// export
export default main