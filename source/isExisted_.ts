import fse from 'fs-extra'
import normalizePathToArray from './normalizePathToArray'

// function

const main_ = async (
  source: string | string[],
): Promise<boolean> => {

  const group = normalizePathToArray(source)
  if (!group.length) return false

  const sub_ = async (
    src: string,
  ): Promise<boolean> => {

    if (src.includes('*'))
      throw new Error(`invalid path '${src}'`)

    return fse.pathExists(src)
  }

  const listResult = await Promise.all(group.map(sub_))
  return !listResult.includes(false)
}

// export
export default main_
