import $info, { renderPath } from './info'
import $getBasename from './getBasename'
import $getDirname from './getDirname'
import $normalizePath from './normalizePath'
import $normalizePathToArray from './normalizePathToArray'
import $parseString from './parseString'
import $source from './source'
import $wrapList from './wrapList'
import _trim from 'lodash/trim'
import archiver from 'archiver'
import fs from 'fs'
import kleur from 'kleur'

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
): Promise<void> => {

  const { base, filename } = option

  const listResource = await $source(listSource)

  await new Promise(resolve => {

    const output = fs.createWriteStream(`${target}/${filename}`)
    const archive = archiver('zip', {
      zlib: {
        level: 9,
      },
    })
    let message = ''

    archive.on('end', () => resolve(true))

    archive.on('entry', e => message = renderPath(`${e.name}`))

    archive.on('error', e => {
      $info(kleur.red(e.message))
      throw e
    })

    archive.on('progress', e => {
      if (!message) return

      const gray = kleur.gray(`${Math.round(e.fs.processedBytes * 100 / e.fs.totalBytes)}%`)
      const magenta = kleur.magenta(message)

      $info(`${gray} ${magenta}`)
      message = ''
    })

    archive.on('warning', e => {
      $info(kleur.red(e.message))
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

const formatArgument = (
  source: string | string[],
  target: string,
  option: string | Option,
): [string[], string, OptionRequired] => {

  const listSource = $normalizePathToArray(source)
  const pathTarget = $normalizePath(
    target || $getDirname(listSource[0]).replace(/\*/g, '')
  )

  let [base, filename] = typeof option === 'string'
    ? ['', option]
    : [
      option.base || '',
      option.filename || '',
    ]

  base = $normalizePath(base || getBase(listSource))
  if (!filename) filename = `${$getBasename(pathTarget)}.zip`

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
  if (source.includes('*')) return _trim(source.replace(/\*.*/u, ''), '/')
  return $getDirname(source)
}

const main = async (
  source: string | string[],
  target = '',
  option: string | Option = '',
): Promise<void> => {
  await execute(...formatArgument(source, target, option))
  $info('zip', `zipped ${$wrapList(source)} to '${target}', as '${$parseString(option)}'`)
}

// export
export default main