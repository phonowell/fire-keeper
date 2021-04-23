import path from 'path'

// interface

type Name = {
  basename: string
  dirname: string
  extname: string
  filename: string
}

// function

const main = (
  input: string,
): Name => {

  if (!input) throw new Error(`getName/error: empty input`)

  const _input = input
    .replace(/\\/g, '/')

  const extname = path.extname(_input)
  const basename = path.basename(_input, extname)
  const dirname = path.dirname(_input)
  const filename = `${basename}${extname}`

  return { basename, dirname, extname, filename }
}

// export
export default main