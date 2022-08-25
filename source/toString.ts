import $type from './getType'

// interface

type HasToString = {
  toString: () => string
}

// function

const main = (input: unknown) => {
  if (typeof input === 'string') return input

  if (input instanceof Array)
    return JSON.stringify({ __container__: input })
      .replace(/\{(.*)\}/u, '$1')
      .replace(/"__container__":/u, '')

  if ($type(input) === 'object') return JSON.stringify(input)
  if (validateAsHasToString(input)) return input.toString()
  return String(input)
}

const validateAsHasToString = (input: unknown): input is HasToString =>
  typeof (input as HasToString)?.toString === 'function'

// export
export default main
