import fse from 'fs-extra'
import log from './log'
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

  log('file', `created ${wrapList(source)}`)
}

// export
export default main
