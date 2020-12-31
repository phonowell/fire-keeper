import formatArgument from './formatArgument'
import normalizePath from './normalizePath'

// function

function main(
  source: string | string[]
): string[] {

  return formatArgument(source)
    .map(it => normalizePath(it))
}

// export
export default main
