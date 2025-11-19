import fs from 'fs'

import archiver from 'archiver'
import kleur from 'kleur'
import { trim } from 'radash'

import echo, { renderPath } from './echo.js'
import getBasename from './getBasename.js'
import getDirname from './getDirname.js'
import glob from './glob.js'
import normalizePath from './normalizePath.js'
import convertToArray from './toArray.js'
import wrapList from './wrapList.js'

type Options = {
  base?: string
  filename?: string
}

type OptionsRequired = Required<Options>

const getBase = (listSource: string[]): string => {
  const source = listSource.at(0)
  if (source?.includes('*')) return trim(source.replace(/\*.*/u, ''), '/')
  return getDirname(source ?? '')
}

const toArray = (
  source: string | string[],
  target: string,
  option: string | Options,
): [string[], string, OptionsRequired] => {
  const listSource = convertToArray(source).map(normalizePath)
  const pathTarget = normalizePath(
    target || getDirname(listSource.at(0) ?? '').replace(/\*/g, ''),
  )

  const [base, filename] =
    typeof option === 'string'
      ? ['', option]
      : [option.base ?? '', option.filename ?? '']

  const finalBase = normalizePath(base || getBase(listSource))
  const finalFilename = filename || `${getBasename(pathTarget)}.zip`

  return [listSource, pathTarget, { base: finalBase, filename: finalFilename }]
}

const execute = async (
  listSource: string[],
  target: string,
  options: OptionsRequired,
) => {
  const { base, filename } = options
  const listResource = await glob(listSource)

  return new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(`${target}/${filename}`)
    const archive = archiver('zip', { zlib: { level: 9 } })
    let message = ''

    archive.on('end', () => resolve())
    archive.on('entry', (e) => (message = renderPath(e.name)))
    archive.on('error', reject)
    archive.on('warning', reject)

    archive.on('progress', (e) => {
      if (!message) return

      const gray = kleur.gray(
        `${Math.round((e.fs.processedBytes * 100) / e.fs.totalBytes)}%`,
      )
      const magenta = kleur.magenta(message)
      console.log(`${gray} ${magenta}`)
      message = ''
    })

    archive.pipe(output)

    for (const src of listResource) {
      const name = src.replace(base, '')
      archive.file(src, { name })
    }

    archive.finalize()
  })
}

/**
 * Zip the source to the target.
 * @param source The source file or directory.
 * @param target The target directory.
 * @param option The option.
 * @example
 * ```
 * zip('src', 'dist', 'archive.zip')
 * zip('src', 'dist', { base: 'src', filename: 'archive.zip' })
 * zip(['src', 'public'], 'dist', 'archive.zip')
 * zip(['src', 'public'], 'dist', { base: 'src', filename: 'archive.zip' })
 * ```
 */
const zip = async (
  source: string | string[],
  target = '',
  option: string | Options = '',
) => {
  await execute(...toArray(source, target, option))

  const optionStr =
    typeof option === 'object' ? JSON.stringify(option) : String(option)
  echo('zip', `zipped ${wrapList(source)} to **${target}**, as **${optionStr}**`)
}

export default zip
