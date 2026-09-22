import fse from 'fs-extra'

import echo from './echo.js'
import getName from './getName.js'
import glob from './glob.js'
import normalizePath from './normalizePath.js'
import runConcurrent from './runConcurrent.js'
import wrapList from './wrapList.js'

type Dirname = string | ((dirname: string) => string | Promise<string>)
type Filename = string | ((filename: string) => string | Promise<string>)

type Options = {
  concurrency?: number
  echo?: boolean
  filename?: Filename
}

const DEFAULT_CONCURRENCY = 5

const asOptions = (input: unknown): Options | undefined =>
  typeof input === 'object' && input !== null ? (input as Options) : undefined

/**
 * Copy files with concurrent operations and flexible path handling
 * @param source - File path(s) or glob pattern(s)
 * @param target - Target directory or path transform function. If empty uses current dir
 * @param options - Filename string/transform, or options object {concurrency?, filename?, echo?}
 * @example
 * copy('src.txt') // Creates src.copy.txt
 * copy('src.txt', 'dist') // Creates dist/src.txt
 * copy('*.ts', 'dist', { filename: f => f.replace('.ts','.js'), echo: false })
 */
const copy = async (
  source: string | string[],
  target?: Dirname,
  options?: Dirname | Options,
  ...rest: unknown[]
): Promise<void> => {
  if (rest.length) throw new TypeError('copy: too many arguments — merge { echo } into options')

  const listSource = await glob(source, {
    followSymbolicLinks: false,
    onlyFiles: false,
  })

  const optionObject = asOptions(options)
  const shouldEcho = optionObject?.echo ?? true

  if (!listSource.length) {
    if (shouldEcho) echo('copy', `no files found matching ${wrapList(source)}`)

    return
  }

  // 并发复制
  await runConcurrent(
    optionObject?.concurrency ?? DEFAULT_CONCURRENCY,
    listSource.map((src) => () => child(src, target, options)),
  )

  // 输出信息
  const targetInfo = target && typeof target === 'string' ? ` to **${target}**` : ''
  const optionsInfo = options && typeof options === 'string' ? ` as **${options}**` : ''

  if (shouldEcho) {
    echo('copy', `copied **${wrapList(source)}**${targetInfo}${optionsInfo}`.trim())
  }
}

const child = async (source: string, target?: Dirname, options?: Dirname | Options) => {
  const { basename, dirname: sourceDirname, extname, filename } = getName(source)

  // 目标目录
  const dirname = !target
    ? sourceDirname
    : typeof target === 'string'
      ? target
      : await target(sourceDirname)

  const fallback = dirname === sourceDirname ? `${basename}.copy${extname}` : filename

  // 文件名
  const option = typeof options === 'object' ? asOptions(options)?.filename : options
  const name = typeof option === 'function' ? await option(filename) : (option ?? fallback)

  await fse.copy(source, normalizePath(`${dirname}/${name}`))
}

export default copy
