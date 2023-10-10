import $type from './getType'

// interface

type HasToString = {
  toString: () => string
}

// function

const main = (input: unknown) => {
  if (typeof input === 'string') return input

  if (input instanceof Array) return JSON.stringify(input)

  if ($type(input) === 'object') return JSON.stringify(input)
  if (validateAsHasToString(input)) return input.toString()
  return String(input)
}

const validateAsHasToString = (input: unknown): input is HasToString =>
  typeof (input as HasToString | undefined)?.toString === 'function'

// export
export default main
