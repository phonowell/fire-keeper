import echo from './echo'
import fse from 'fs-extra'
import normalizePath from './normalizePath'
import toArray from './toArray'
import wrapList from './wrapList'

// function

const main = async (source: string | string[]) => {
  if (!source) throw new Error('mkdir/error: empty source')

  const listSource = toArray(source).map(normalizePath)
  for (const src of listSource) {
    await fse.ensureDir(src)
  }

  echo('file', `created ${wrapList(source)}`)
}

// export
export default main
