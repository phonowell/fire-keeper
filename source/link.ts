import $info from './info'
import $normalizePath from './normalizePath'
import fse from 'fs-extra'

// function

const main = async (
  source: string,
  target: string,
): Promise<void> => {

  const _source = $normalizePath(source)
  const _target = $normalizePath(target)
  await fse.ensureSymlink(_source, _target)

  $info('file', `linked '${source}' to '${target}'`)
}

// export
export default main