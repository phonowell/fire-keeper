import path from 'path'

// function

const main = (input: string) => {
  if (!input) throw new Error(`getName/error: empty input`)

  const _input = input.replace(/\\/g, '/')

  const extname = path.extname(_input)
  const basename = path.basename(_input, extname)
  const dirname = path.dirname(_input)
  const filename = `${basename}${extname}`

  return { basename, dirname, extname, filename }
}

// export
export default main
