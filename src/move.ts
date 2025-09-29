import copy from './copy.js'
import remove from './remove.js'

type Dirname = string | ((dirname: string) => string | Promise<string>)

type Options = {
  concurrency?: number
}

/**
 * Move files/directories using copy-then-remove strategy
 * @param source - Source path(s) to move
 * @param target - Target directory or path generator function
 * @param options - Configuration with concurrency setting
 * @example
 * await move('file.txt', 'archive/')
 * await move(['*.log'], name => `backup/${name}`)
 */
const move = async (
  source: string | string[],
  target: Dirname,
  { concurrency = 5 }: Options = {},
) => {
  await copy(source, target, { concurrency })
  await remove(source, { concurrency })
}

export default move
