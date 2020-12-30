import $ from '..'
import fse from 'fs-extra'

// function

async function main_(
  source: string,
  content: unknown,
  option?: string | fse.WriteFileOptions,
): Promise<boolean> {

  const _source = $.normalizePath(source)
  const _content = $.parseString(content)

  await fse.outputFile(_source, _content, option)
  $.info('file', `wrote ${$.wrapList(source)}`)
  return true
}

// export
export default main_
