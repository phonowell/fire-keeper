import fse from 'fs-extra'
import log from './log'
import normalizePath from './normalizePath'

// function

const main = async (
  source: string,
  target: string,
) => {

  const _source = normalizePath(source)
  const _target = normalizePath(target)
  await fse.ensureSymlink(_source, _target)

  log('file', `linked '${source}' to '${target}'`)
}

// export
export default main