import fse from 'fs-extra'
import getBasename from './getBasename'
import getDirname from './getDirname'
import getExtname from './getExtname'
import getFilename from './getFilename'
import glob from './glob'
import isAsyncFunction from './isAsyncFunction'
import isFunction from './isFunction'
import log from './log'
import normalizePath from './normalizePath'
import wrapList from './wrapList'

// interface

type Input = string | ((input: string) => string | Promise<string>)

// function

const execute = async (
  fn: (input: string) => string | Promise<string>,
  input: string
) => {
  if (isAsyncFunction(fn)) return await fn(input)
  return fn(input)
}

const main = async (
  source: string | string[],
  target?: Input,
  name?: Input
) => {
  const listSource = await glob(source)

  for (const src of listSource) {
    const dirname = await (async () => {
      const dirname = getDirname(src)
      if (!target) return dirname
      if (isFunction(target)) return await execute(target, dirname)
      return target
    })()

    const filename = await (async () => {
      const filename = getFilename(src)
      if (!name)
        return dirname === getDirname(src)
          ? `${getBasename(src)}.copy${getExtname(src)}`
          : filename
      if (isFunction(name)) return await execute(name, filename)
      return name
    })()

    await fse.copy(src, normalizePath(`${dirname}/${filename}`))
  }

  log(
    'file',
    [
      `copied ${wrapList(source)}`,
      target && typeof target === 'string' ? ` to '${target}'` : '',
      name && typeof name === 'string' ? ` as '${name}'` : '',
    ]
      .filter(it => !!it)
      .join('')
  )
}

// export
export default main
