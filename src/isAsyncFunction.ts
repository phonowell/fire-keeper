import isFunction from './isFunction'

// function

const main = (input: unknown): input is () => Promise<unknown> => {
  if (!isFunction(input)) return false

  const type = Object.prototype.toString
    .call(input)
    .replace(/^\[object (.+)\]$/, '$1')
    .toLowerCase()

  return type === 'asyncfunction'
}

// export
export default main
