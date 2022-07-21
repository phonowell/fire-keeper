import fse from 'fs-extra'
import normalizePath from './normalizePath'
import toArray from './toArray'

// function

const main = async (
  source: string | string[],
): Promise<boolean> => {

  const group = toArray(source).map(normalizePath)
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
