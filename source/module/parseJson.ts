import $ from '..'

// function

function main(input: unknown): unknown[] | Object {
  if (typeof input === 'string') return JSON.parse(input)
  if (input instanceof Array) return input
  if (input instanceof Uint8Array) return JSON.parse(input.toString())
  const type = $.type(input)
  if (type === 'object') return input as Object
  throw new Error(`parseJson/error: invalid type '${type}'`)
}

// export
export default main