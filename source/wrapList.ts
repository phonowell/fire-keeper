import toArray from './toArray'

// function

const main = (
  input: unknown,
): string => (input
  ? toArray(input)
    .map(it => `'${it}'`)
    .join(', ')
  : '')

// export
export default main