import toArray from './toArray'
import toString from './toString'

// function

const main = (input: unknown) =>
  input
    ? toArray(input)
        .map(it => `'${toString(it)}'`)
        .join(', ')
    : ''

// export
export default main
