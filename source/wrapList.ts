import $formatArgument from './formatArgument'

// function

const main = (
  input: unknown,
): string => input
    ? $formatArgument(input)
      .map(it => `'${it}'`)
      .join(', ')
    : ''

// export
export default main