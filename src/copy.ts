import fse from 'fs-extra'

import echo from './echo'
import getDirname from './getDirname'
import getName from './getName'
import glob from './glob'
import normalizePath from './normalizePath'
import run from './run'
import runConcurrent from './runConcurrent'
import wrapList from './wrapList'

type Dirname = string | ((dirname: string) => string | Promise<string>)
type Filename = string | ((filename: string) => string | Promise<string>)

type Options = {
  concurrency?: number
  filename?: Filename
}

const DEFAULT_CONCURRENCY = 5

/**
 * Copy files and directories with support for concurrent operations and flexible naming.
 * Handles multiple files, glob patterns, and provides customization options for target paths and filenames.
 * Includes smart path handling and performance optimizations for large-scale operations.
 *
 * @param {string | string[]} source - Source file(s) or directory path(s). Can be:
 *   - A single path
 *   - An array of paths
 *   - Glob pattern(s)
 * @param {string | ((dirname: string) => string | Promise<string>)} [target] - Target directory or transform function:
 *   - If undefined: Creates copy in same directory with '.copy' suffix
 *   - If empty string (''):  Uses current directory
 *   - If string: Copies to specified directory path (supports ~/ for home dir)
 *   - If function: Dynamically generates target path (can be async)
 * @param {Object | string | ((filename: string) => string | Promise<string>)} [options] - Configuration options:
 *   - If string: Used as target filename
 *   - If function: Generates target filename (can be async)
 *   - If object: Advanced options object
 * @param {number} [options.concurrency=5] - Maximum concurrent copy operations
 * @param {string | ((name: string) => string | Promise<string>)} [options.filename] - Target filename or transform function
 * @returns {Promise<void>} Resolves when all copy operations are complete
 *
 * @example
 * // Basic copy with smart naming
 * await copy('source.txt')                // creates source.copy.txt in same dir
 * await copy('source.txt', 'target')      // creates target/source.txt
 *
 * // Advanced path handling
 * await copy('file.txt', '')              // copy to current directory
 * await copy('file.txt', '~/backup')      // copy to home directory (macOS/Linux)
 * await copy(['a.txt', 'b.txt'], 'dist')  // copy multiple files
 *
 * // Dynamic paths with async functions
 * await copy('data.txt', async dirname => {
 *   const timestamp = await getTimestamp()
 *   return `backup/${timestamp}`
 * })
 *
 * // Custom naming with type preservation
 * await copy('src/*.ts', 'dist', {
 *   filename: name => name.replace('.ts', '.js'),
 * })
 *
 * // Large-scale operations with concurrency control
 * await copy('assets/*.png', 'dist', {
 *   concurrency: 3,  // limit concurrent operations
 * })
 *
 * // Mixed patterns with glob
 * await copy([
 *   'src/*.js',
 *   'src/*.ts',
 *   '!src/*.test.ts',  // exclude test files
 * ], 'dist')
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
