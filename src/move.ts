import copy from './copy.js'
import remove from './remove.js'

type Dirname = string | ((dirname: string) => string | Promise<string>)

type Options = {
  concurrency?: number
  echo?: boolean
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
  { concurrency = 5, echo: shouldEcho = true }: Options = {},
) => {
  await copy(source, target, { concurrency, echo: shouldEcho })
  await remove(source, { concurrency, echo: shouldEcho })
}

export default move
