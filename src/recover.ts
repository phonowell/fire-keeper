import echo from './echo'
import glob from './glob'
import read from './read'
import remove from './remove'
import toArray from './toArray'
import wrapList from './wrapList'
import write from './write'

// functions

/**
 * Recover files or directories.
 * @param source A source file or directory.
 * @returns The promise.
 * @example
 * ```
 * await recover('file.txt')
 * await recover(['file1.txt', 'file2.txt'])
 * ```
 */
const main = async (source: string | string[]) => {
  const listSource = await glob(toArray(source).map(src => `${src}.bak`))

  for (const src of listSource) {
    await recover(src)
  }

  echo('recover', `recovered ${wrapList(source)}`)
}

const recover = async (source: string) => {
  const content = await read(source)
  await write(source.replace('.bak', ''), content)
  await remove(source)
}

// export
export default main
