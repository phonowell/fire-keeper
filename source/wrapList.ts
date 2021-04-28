import $formatArgument from './formatArgument'

// function

const main = (
  input: unknown,
): string => {

  if (!input) return ''
  return $formatArgument(input)
    .map(it => `'${it}'`)
    .join(', ')
}

// export
export default main