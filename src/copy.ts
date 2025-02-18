import fse from 'fs-extra'

import echo from './echo'
import getDirname from './getDirname'
import glob from './glob'
import normalizePath from './normalizePath'
import wrapList from './wrapList'
import run from './run'
import getName from './getName'

type Dirname = string | ((dirname: string) => string | Promise<string>)
type Filename = string | ((filename: string) => string | Promise<string>)

type Options = {
  filename?: Filename
  isConcurrent?: boolean
}

/**
 * Copy files or directories with advanced naming options.
 * @param source - Source file(s) or directory. Can be a single path or array of paths.
 * @param target - Optional target directory or function that returns target path.
 * @param options - Copy options or new filename
 * @param options.filename - New filename or function to generate filename
 * @param options.isConcurrent - Whether to copy files concurrently (default: true)
 * @throws {Error} When source file doesn't exist or copy operation fails
 * @returns Promise that resolves when copy is complete
 *
 * @example Single file copy
 * ```ts
 * await copy('source.txt');  // Creates source.copy.txt
 * ```
 *
 * @example Multiple files copy
 * ```ts
 * await copy(['file1.txt', 'file2.txt'], 'backup');
 * ```
 *
 * @example Copy with rename
 * ```ts
 * await copy('file.txt', 'backup', 'newname.txt');
 * ```
 *
 * @example Dynamic target path
 * ```ts
 * await copy('file.txt', name => `backup/${name}`);
 * ```
 *
 * @example Custom options
 * ```ts
 * await copy('file.txt', 'backup', {
 *   filename: name => `${name}-${Date.now()}`,
 *   isConcurrent: false
 * });
 * ```
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
  // 默认为 true
  const isConcurrent = run(() => {
    if (!options) return true
    if (typeof options !== 'object') return true
    return options.isConcurrent ?? true
  })

  // 并发复制
  if (isConcurrent)
    await Promise.all(listSource.map(src => child(src, target, options)))
  else for (const src of listSource) await child(src, target, options)

  // 输出信息
  echo(
    'copy',
    [
      `copied ${wrapList(source)}`,
      !!target && typeof target === 'string' ? `to '${target}'` : '',
      !!options && typeof options === 'string' ? `as '${options}'` : '',
    ]
      .filter(it => !!it)
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
