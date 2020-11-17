import path from 'path'

// function

function main(input: string): {
  basename: string
  dirname: string
  extname: string
  filename: string
} {

  if (!input) throw new Error(`getName/error: empty input`)

  input = input
    .replace(/\\/g, '/')

  const extname = path.extname(input)
  const basename = path.basename(input, extname)
  const dirname = path.dirname(input)
  const filename = `${basename}${extname}`

  return { basename, dirname, extname, filename }
}

// export
export default main