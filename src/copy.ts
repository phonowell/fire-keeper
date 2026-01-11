import fse from 'fs-extra'

import echo from './echo.js'
import getDirname from './getDirname.js'
import getName from './getName.js'
import glob from './glob.js'
import normalizePath from './normalizePath.js'
import runConcurrent from './runConcurrent.js'
import wrapList from './wrapList.js'

type Dirname = string | ((dirname: string) => string | Promise<string>)
type Filename = string | ((filename: string) => string | Promise<string>)

type Options = {
  concurrency?: number
  filename?: Filename
}

const DEFAULT_CONCURRENCY = 5

/**
 * Copy files with concurrent operations and flexible path handling
 * @param source - File path(s) or glob pattern(s)
 * @param target - Target directory or path transform function. If empty uses current dir
 * @param options - Target filename or options object with {concurrency?, filename?}
 * @example
 * copy('src.txt') // Creates src.copy.txt
 * copy('src.txt', 'dist') // Creates dist/src.txt
 * copy('*.ts', 'dist', { filename: f => f.replace('.ts','.js') })
 */
const copy = async (
  source: string | string[],
  target?: Dirname,
  options?: Dirname | Options,
): Promise<void> => {
  const listSource = await glob(source, { onlyFiles: true })

  if (!listSource.length) {
    echo('copy', `no files found matching ${wrapList(source)}`)
    return
  }

  const concurrency =
    options && typeof options === 'object'
      ? (options.concurrency ?? DEFAULT_CONCURRENCY)
      : DEFAULT_CONCURRENCY

  // 并发复制
  await runConcurrent(
    concurrency,
    listSource.map((src) => () => child(src, target, options)),
  )

  // 输出信息
  const targetInfo =
    target && typeof target === 'string' ? ` to **${target}**` : ''
  const optionsInfo =
    options && typeof options === 'string' ? ` as **${options}**` : ''

  echo(
    'copy',
    `copied **${wrapList(source)}**${targetInfo}${optionsInfo}`.trim(),
  )
}

const child = async (
  source: string,
  target?: Dirname,
  options?: Dirname | Options,
) => {
  // 目标目录
  const sourceDirname = getDirname(source)
  const dirname = !target
    ? sourceDirname
    : typeof target === 'string'
      ? target
      : await target(sourceDirname)

  // 文件名
  const {
    basename,
    dirname: fileSourceDirname,
    extname,
    filename: originalFilename,
  } = getName(source)

  const defaultFilename =
    dirname === fileSourceDirname
      ? `${basename}.copy${extname}`
      : originalFilename

  // 无 options
  if (!options)
    return fse.copy(source, normalizePath(`${dirname}/${defaultFilename}`))

  // options 是字符串（目标文件名）
  if (typeof options === 'string')
    return fse.copy(source, normalizePath(`${dirname}/${options}`))

  // options 是函数（异步文件名转换）
  if (typeof options === 'function') {
    const filename = await options(originalFilename)
    return fse.copy(source, normalizePath(`${dirname}/${filename}`))
  }

  // options 是对象，且 filename 是字符串
  if (typeof options.filename === 'string')
    return fse.copy(source, normalizePath(`${dirname}/${options.filename}`))

  // options 是对象，且 filename 是函数
  if (typeof options.filename === 'function') {
    const filename = await options.filename(originalFilename)
    return fse.copy(source, normalizePath(`${dirname}/${filename}`))
  }

  // options 是对象但无 filename（使用默认）
  return fse.copy(source, normalizePath(`${dirname}/${defaultFilename}`))
}

export default copy
