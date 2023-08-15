import $type from './getType'

// interface

type Result = Record<string, unknown> | unknown[]

// function

const main = (input: unknown) => {
  if (typeof input === 'string') return JSON.parse(input) as Result
  if (input instanceof Array) return input as unknown[]
  if (input instanceof Uint8Array) return JSON.parse(input.toString()) as Result
  const type = $type(input)
  if (type === 'object') return input as Record<string, unknown>
  throw new Error(`toJson/error: invalid type '${type}'`)
}

// export
export default main
