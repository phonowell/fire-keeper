import $ from '..'

// function

function main(
  source: string
): unknown {

  return require($.normalizePath(source))
}

// export
export default main
