import $ from '..'

// function

function main(source: string | string[]): string[] {
  return $.formatArgument(source)
    .map(it => $.normalizePath(it))
}

// export
export default main