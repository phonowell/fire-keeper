import normalizePath from './normalizePath'

// function

function main(
  source: string
): unknown {

  return require(normalizePath(source))
}

// export
export default main
