import fse from 'fs-extra'

import echo from './echo'
import getBasename from './getBasename'
import getDirname from './getDirname'
import getExtname from './getExtname'
import getFilename from './getFilename'
import glob from './glob'
import normalizePath from './normalizePath'
import wrapList from './wrapList'
import run from './run'

type Input = string | ((input: string) => string | Promise<string>)

/**
 * Copy files or directories.
 * @param source A source file or directory.
 * @param target A target directory.
 * @param name A new name.
 * @returns The promise.
 * @example
 * ```
 * await copy('file.txt')
 * await copy(['file1.txt', 'file2.txt'])
 * await copy('file.txt', 'backup')
 * await copy('file.txt', 'backup', 'file.bak')
 * await copy('file.txt', name => `backup/${name}`)
 * ```
 */
const copy = async (
  source: string | string[],
  target?: Input,
  name?: Input,
) => {
  const listSource = await glob(source)

  for (const src of listSource) {
    const dirname = await run(() => {
      const dname = getDirname(src)
      if (!target) return dname
      if (typeof target === 'function') return execute(target, dname)
      return target
    })

    const filename = await run(() => {
      const fname = getFilename(src)
      if (!name)
        return dirname === getDirname(src)
          ? `${getBasename(src)}.copy${getExtname(src)}`
          : fname
      if (typeof name === 'function') return execute(name, fname)
      return name
    })

    await fse.copy(src, normalizePath(`${dirname}/${filename}`))
  }

  echo(
    'file',
    [
      `copied ${wrapList(source)}`,
      target && typeof target === 'string' ? ` to '${target}'` : '',
      name && typeof name === 'string' ? ` as '${name}'` : '',
    ]
      .filter(it => !!it)
      .join(''),
  )
}

const execute = (
  fn: (input: string) => string | Promise<string>,
  input: string,
) => {
  return fn(input)
}

export default copy
