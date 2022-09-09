import echo from './echo'
import fse from 'fs-extra'
import normalizePath from './normalizePath'
import toString from './toString'
import wrapList from './wrapList'

// function

const main = async (
  source: string,
  content: unknown,
  options?: fse.WriteFileOptions
) => {
  await fse.outputFile(normalizePath(source), toString(content), options)
  echo('file', `wrote ${wrapList(source)}`)
}

// export
export default main
