// function

function main(
  input: unknown
): string {

  return Object.prototype.toString.call(input)
    .replace(/^\[object (.+)]$/, '$1')
    .toLowerCase()
}

// export
export default main