import fse from 'fs-extra'
import log from './log'
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
  log('file', `wrote ${wrapList(source)}`)
}

// export
export default main
