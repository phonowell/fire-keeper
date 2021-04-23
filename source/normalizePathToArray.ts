import formatArgument from './formatArgument'
import normalizePath from './normalizePath'

// function

const main = (
  source: string | string[],
): string[] => formatArgument(source)
  .map(it => normalizePath(it))

// export
export default main