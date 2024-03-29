import getDirname from './getDirname'
import glob from './glob'
import remove from './remove'

// function

/**
 * Clean files or directories.
 * @param source A source file or directory.
 * @returns The promise.
 * @example
 * ```
 * await clean('file.txt')
 * await clean(['file1.txt', 'file2.txt'])
 * ```
 */
const clean = async (source: string | string[]) => {
  const listSource = await glob(source, { onlyFiles: false })
  await remove(source)
  const dirname = getDirname(listSource[0])
  if ((await glob(`${dirname}/**/*`)).length) return
  await remove(dirname)
}

// export
export default clean
