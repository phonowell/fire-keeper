import $ from '..'
import fse from 'fs-extra'

// function

async function main_(
  source: string,
  content: unknown,
  option?: string | fse.WriteFileOptions
) {

  source = $.normalizePath(source)
  content = $.parseString(content)

  await fse.outputFile(source, content, option)
  $.info('file', `wrote ${$.wrapList(source)}`)
  return true
}

// export
export default main_