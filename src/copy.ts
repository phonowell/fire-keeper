import fse from 'fs-extra'

import echo from './echo.js'
import getDirname from './getDirname.js'
import getName from './getName.js'
import glob from './glob.js'
import normalizePath from './normalizePath.js'
import run from './run.js'
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
  const listSource = await glob(source)
  if (!listSource.length) {
    echo('copy', `no files found matching ${wrapList(source)}`)
    return
  }

  // 是否并发复制
  // 默认为 DEFAULT_CONCURRENCY
  const c = run(() => {
    if (!options) return DEFAULT_CONCURRENCY
    if (typeof options !== 'object') return DEFAULT_CONCURRENCY
    return options.concurrency ?? DEFAULT_CONCURRENCY
  })

  // 并发复制
  await runConcurrent(
    c,
    listSource.map((src) => () => child(src, target, options)),
  )

  // 输出信息
  echo(
    'copy',
    [
      `copied ${wrapList(source)}`,
      !!target && typeof target === 'string' ? `to '${target}'` : '',
      !!options && typeof options === 'string' ? `as '${options}'` : '',
    ]
      .filter((it) => !!it)
      .join(' ')
      .trim(),
  )
}

const child = async (
  source: string,
  target?: Dirname,
  options?: Dirname | Options,
) => {
  // 目标目录
  const dirname = await run(() => {
    const dname = getDirname(source)

    // 当 target 为 undefined 时，表示复制到当前目录
    if (!target) return dname

    // 当 target 为字符串时，表示复制到指定目录
    if (typeof target === 'string') return target

    // 当 target 为函数时，获取其返回值
    return target(dname)
  })

  // 文件名
  const filename = await run(() => {
    const {
      basename: bname,
      dirname: dname,
      extname: ename,
      filename: fname,
    } = getName(source)

    // 当不指定 options 时，生成默认文件名
    // 当在同一目录下时，添加 .copy 中间缀
    // 当在不同目录下时，保持原文件名
    if (!options) return dirname === dname ? `${bname}.copy${ename}` : fname

    // 当 options 为字符串时，表示文件名
    if (typeof options === 'string') return options

    // 当 options 为函数时，获取其返回值
    if (typeof options === 'function') return options(fname)

    // 当 options 为对象时，获取 filename 字段
    if (typeof options.filename === 'string') return options.filename

    // 当 options 为对象时，获取 filename 函数的返回值
    if (typeof options.filename === 'function') return options.filename(fname)

    // 默认返回
    return dirname === dname ? `${bname}.copy${ename}` : fname
  })

  // 执行复制
  await fse.copy(source, normalizePath(`${dirname}/${filename}`))
}

export default copy
