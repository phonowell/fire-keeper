// function

const main = (input: unknown) => {
  const type = Object.prototype.toString
    .call(input)
    .replace(/^\[object (.+)\]$/, '$1')
    .toLowerCase()

  return type === 'asyncfunction' ? 'function' : type
}

// export
export default main
