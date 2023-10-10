// function

const main = (input: unknown): input is (...args: unknown[]) => unknown =>
  input instanceof Function

// export
export default main
