import path from 'path'

// function

const main = (input: string) => {
  if (!input) throw new Error(`getName/error: empty input`)

  const ipt = input.replace(/\\/g, '/')

  const extname = path.extname(ipt)
  const basename = path.basename(ipt, extname)
  const dirname = path.dirname(ipt)
  const filename = `${basename}${extname}`

  return { basename, dirname, extname, filename }
}

// export
export default main
