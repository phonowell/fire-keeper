// function

const main = (
  input: unknown,
): string => Object.prototype.toString.call(input)
  .replace(/^\[object (.+)\]$/, '$1')
  .toLowerCase()

// export
export default main