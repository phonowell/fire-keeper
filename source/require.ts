import $normalizePath from './normalizePath'

// function

const main = <T>(
  source: string,
): T => require($normalizePath(source))

// export
export default main