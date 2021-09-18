import $normalizePathToArray from './normalizePathToArray'
import fse from 'fs-extra'

// function

const main = async (
  source: string | string[],
): Promise<boolean> => {

  const group = $normalizePathToArray(source)
  if (!group.length) return false

  const listResult = await Promise.all(group.map(sub))
  return !listResult.includes(false)
}

const sub = (
  src: string,
): Promise<boolean> => {
  if (src.includes('*')) throw new Error(`invalid path '${src}'`)
  return fse.pathExists(src)
}

// export
export default main
