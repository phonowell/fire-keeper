import $getDirname from './getDirname'
import $normalizePathToArray from './normalizePathToArray'
import $remove from './remove_'
import $source from './source_'

// function

const main = async (
  source: string | string[],
): Promise<void> => {

  const listSource = $normalizePathToArray(source)
  await $remove(listSource)

  const dirname = $getDirname(listSource[0])
  if ((await $source(`${dirname}/**/*`)).length) return
  await $remove(dirname)
}

// export
export default main