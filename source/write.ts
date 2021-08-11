import $info from './info'
import $normalizePath from './normalizePath'
import $parseString from './parseString'
import $wrapList from './wrapList'
import fse from 'fs-extra'

// function

const main = async (
  source: string,
  content: unknown,
  option?: string | fse.WriteFileOptions,
): Promise<boolean> => {

  const _source = $normalizePath(source)
  const _content = $parseString(content)

  await fse.outputFile(_source, _content, option)
  $info('file', `wrote ${$wrapList(source)}`)
  return true
}

// export
export default main
