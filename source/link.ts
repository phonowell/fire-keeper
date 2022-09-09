import echo from './echo'
import fse from 'fs-extra'
import normalizePath from './normalizePath'

// function

const main = async (source: string, target: string) => {
  const _source = normalizePath(source)
  const _target = normalizePath(target)
  await fse.ensureSymlink(_source, _target)

  echo('file', `linked '${source}' to '${target}'`)
}

// export
export default main
