import copy from './copy'
import remove from './remove'

type Input = string | ((input: string) => string | Promise<string>)

/**
 * Move files or directories.
 * @param source A source file or directory.
 * @param target A target directory.
 * @returns The promise.
 * @example
 * ```
 * await move('file.txt', 'backup')
 * await move(['file1.txt', 'file2.txt'], 'backup')
 * await move('file.txt', name => `backup/${name}`)
 * ```
 */
const move = async (source: string | string[], target: Input) => {
  await copy(source, target)
  await remove(source)
}

export default move
