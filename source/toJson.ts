import $type from './type'

// function

const main = (input: unknown): Record<string, unknown> | unknown[] => {
  if (typeof input === 'string') return JSON.parse(input)
  if (input instanceof Array) return input
  if (input instanceof Uint8Array) return JSON.parse(input.toString())
  const type = $type(input)
  if (type === 'object') return input as Record<string, unknown>
  throw new Error(`toJson/error: invalid type '${type}'`)
}

// export
export default main
