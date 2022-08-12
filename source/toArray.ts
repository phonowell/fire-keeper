// function

const main = <T>(input: T | T[]): T[] =>
  input instanceof Array ? input : [input]

// export
export default main
