import $ from '..'
import archiver from 'archiver'
import fs from 'fs'
import kleur from 'kleur'
import ora from 'ora'
import trim from 'lodash/trim'

// interface

type Option = {
  base?: string
  filename?: string
}

// function

async function archive_(
  listSource: string[],
  target: string,
  option: Required<Option>
): Promise<void> {

  const { base, filename } = option
  const spinner = ora().start()

  await new Promise(async resolve => {

    const output = fs.createWriteStream(`${target}/${filename}`)
    const archive = archiver('zip', {
      zlib: {
        level: 9
      }
    })
    let message = ''

    archive.on('end', () => {
      spinner.succeed()
      resolve(true)
    })

    archive.on('entry', e => {
      message = $.info().renderPath(`${e.name}`)
    })

    archive.on('error', e => {
      spinner.fail(e.message)
      throw (e)
    })

    archive.on('progress', e => {
      if (!message) return

      const gray = kleur.gray(`${Math.round(e.fs.processedBytes * 100 / e.fs.totalBytes)}%`)
      const magenta = kleur.magenta(message)

      spinner.text = `${gray} ${magenta}`
      message = ''
    })

    archive.on('warning', e => {
      spinner.warn(e.message)
      throw (e)
    })

    // execute
    archive.pipe(output)

    for (const src of await $.source_(listSource)) {
      const name = src.replace(base, '')
      archive.file(src, { name })
    }

    archive.finalize()
  })
}

function formatArgument(
  source: string | string[],
  target: string,
  option: string | Option
): [string[], string, Required<Option>] {

  const listSource = $.normalizePathToArray(source)
  const pathTarget = $.normalizePath(
    target || $.getDirname(listSource[0]).replace(/\*/g, '')
  )

  let [base, filename] = typeof option === 'string'
    ? ['', option]
    : [
      option.base || '',
      option.filename || ''
    ]

  base = $.normalizePath(base || getBase(listSource))
  if (!filename) filename = `${$.getBasename(pathTarget)}.zip`

  return [
    listSource,
    pathTarget,
    {
      base,
      filename
    }
  ]
}

function getBase(
  listSource: string[]
): string {

  const [source] = listSource

  if (source.includes('*'))
    return trim(source.replace(/\*.*/, ''), '/')

  return $.getDirname(source)
}

async function main_(
  source: string | string[],
  target: string = '',
  option: string | Option = ''
): Promise<void> {

  await archive_(...formatArgument(source, target, option))
  $.info('zip', `zipped ${$.wrapList(source)} to '${target}', as '${option.toString()}'`)
}

// export
export default main_