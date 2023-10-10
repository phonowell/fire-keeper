import copy from './copy'
import remove from './remove'

// interface

type Input = string | ((input: string) => string | Promise<string>)

// function

const main = async (source: string | string[], target: Input) => {
  await copy(source, target)
  await remove(source)
}

// export
export default main
