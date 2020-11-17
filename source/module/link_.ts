import $ from '..'
import fse from 'fs-extra'

// function

async function main_(
  source: string, target: string
): Promise<void> {

  source = $.normalizePath(source)
  target = $.normalizePath(target)
  await fse.ensureSymlink(source, target)

  $.info('file', `linked '${source}' to '${target}'`)
}

// export
export default main_