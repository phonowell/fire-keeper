import fse from 'fs-extra'
import info from './info'
import normalizePathToArray from './normalizePathToArray'
import wrapList from './wrapList'

// function

async function main_(
  source: string | string[]
): Promise<void> {
  if (!source) throw new Error('mkdir_/error: empty source')

  const listSource = normalizePathToArray(source)
  await Promise.all(listSource.map(it => fse.ensureDir(it)))

  info('file', `created ${wrapList(source)}`)
}

// export
export default main_