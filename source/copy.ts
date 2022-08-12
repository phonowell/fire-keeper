import fse from 'fs-extra'
import getDirname from './getDirname'
import getFilename from './getFilename'
import glob from './glob'
import log from './log'
import normalizePath from './normalizePath'
import wrapList from './wrapList'

// function

const main = async (
  source: string | string[],
  target: string,
  name?: string
) => {
  const listSource = await glob(source)

  for (const src of listSource) {
    const t = `${normalizePath(target || getDirname(src))}/${
      name || getFilename(src)
    }`
    await fse.copy(src, t)
  }

  log(
    'file',
    [
      `copied ${wrapList(source)} to '${target}'`,
      name ? ` as '${name}'` : '',
    ].join('')
  )
}

// export
export default main
