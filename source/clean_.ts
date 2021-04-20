import getDirname from './getDirname'
import normalizePathToArray from './normalizePathToArray'
import remove_ from './remove_'
import source_ from './source_'

// function

const main_ = async (
  source: string | string[],
): Promise<void> => {

  const listSource = normalizePathToArray(source)
  await remove_(listSource)

  const dirname = getDirname(listSource[0])
  if ((await source_(`${dirname}/**/*`)).length) return
  await remove_(dirname)
}

// export
export default main_
