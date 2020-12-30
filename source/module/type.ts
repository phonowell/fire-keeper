// function

function main(
  input: unknown
): string {

  return Object.prototype.toString.call(input)
    .replace(/^\[object (.+)\]$/u, '$1')
    .toLowerCase()
}

// export
export default main
