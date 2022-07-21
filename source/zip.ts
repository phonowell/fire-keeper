import archiver from 'archiver'
import convertToArray from './toArray'
import fs from 'fs'
import getBasename from './getBasename'
import getDirname from './getDirname'
import glob from './glob'
import kleur from 'kleur'
import log, { renderPath } from './log'
import normalizePath from './normalizePath'
import toString from './toString'
import trim from 'lodash/trim'
import wrapList from './wrapList'

// interface

type Option = {
  base?: string
  filename?: string
}

type OptionRequired = Required<Option>

// function

const execute = async (
  listSource: string[],
  target: string,
  option: OptionRequired,
) => {

  const { base, filename } = option

  const listResource = await glob(listSource)

  await new Promise(resolve => {

    const output = fs.createWriteStream(`${target}/${filename}`)
    const archive = archiver('zip', {
      zlib: {
        level: 9,
      },
    })
    let message = ''

    archive.on('end', () => resolve(true))

    archive.on('entry', e => (message = renderPath(`${e.name}`)))

    archive.on('error', e => {
      console.log(kleur.red(e.message))
      throw e
    })

    archive.on('progress', e => {
      if (!message) return

      const gray = kleur.gray(`${Math.round(e.fs.processedBytes * 100 / e.fs.totalBytes)}%`)
      const magenta = kleur.magenta(message)

      console.log(`${gray} ${magenta}`)
      message = ''
    })

    archive.on('warning', e => {
      console.log(kleur.red(e.message))
      throw (e)
    })

    // execute
    archive.pipe(output)

    for (const src of listResource) {
      const name = src.replace(base, '')
      archive.file(src, { name })
    }

    archive.finalize()
  })
}

const toArray = (
  source: string | string[],
  target: string,
  option: string | Option,
): [string[], string, OptionRequired] => {

  const listSource = convertToArray(source).map(normalizePath)
  const pathTarget = normalizePath(target || getDirname(listSource[0]).replace(/\*/g, ''))

  let [base, filename] = typeof option === 'string'
    ? ['', option]
    : [
      option.base || '',
      option.filename || '',
    ]

  base = normalizePath(base || getBase(listSource))
  if (!filename) filename = `${getBasename(pathTarget)}.zip`

  return [
    listSource,
    pathTarget,
    {
      base,
      filename,
    },
  ]
}

const getBase = (
  listSource: string[],
): string => {
  const [source] = listSource
  if (source.includes('*')) return trim(source.replace(/\*.*/u, ''), '/')
  return getDirname(source)
}

const main = async (
  source: string | string[],
  target = '',
  option: string | Option = '',
) => {
  await execute(...toArray(source, target, option))
  log('zip', `zipped ${wrapList(source)} to '${target}', as '${toString(option)}'`)
}

// export
export default main