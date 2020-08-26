import $ from '..'
import fse from 'fs-extra'

// function

async function main_(source: string | string[]): Promise<boolean> {
  const group = $.normalizePathToArray(source)
  if (!group.length) return false

  for (const source of group) {
    if (source.includes('*'))
      throw new Error(`invalid path '${source}'`)
    const isExisted = await fse.pathExists(source)
    if (!isExisted) return false
  }

  return true
}

// export
export default main_