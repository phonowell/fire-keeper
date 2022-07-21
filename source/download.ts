import download from 'download'
import log from './log'
import normalizePath from './normalizePath'
import toString from './toString'

// interface

interface Option {
  filename: string
  timeout: number
}

// function

const format = (
  source: string,
  target: string,
  option: string | Partial<Option>,
): [string, string, Option] => {

  if (!source) throw new Error('download/error: empty source')
  const _source = source.startsWith('//')
    ? `https:${source}`
    : source

  if (!target) throw new Error('download/error: empty target')
  const _target = normalizePath(target)

  const _option = typeof option === 'string'
    ? { filename: option }
    : { ...option }
  const optionX = {
    filename: '',
    timeout: 10e3,
    ..._option,
  }

  return [_source, _target, optionX]
}

const main = async (
  source: string,
  target: string,
  option: string | Partial<Option> = {},
) => {

  await download(...format(source, target, option))
  log('download', `downloaded '${source}' to '${target}', as '${toString(option)}'`)
}

// export
export type { Option }
export default main