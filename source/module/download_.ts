import $ from '..'
import download from 'download'

// interface

interface Option {
  filename: string
  timeout: number
}

// function

function format(
  source: string,
  target: string,
  option: string | Partial<Option>
): [string, string, Option] {

  if (!source) throw new Error('download_/error: empty source')
  const _source = source.startsWith('//')
    ? `https:${source}`
    : source

  if (!target) throw new Error('download_/error: empty target')
  const _target = $.normalizePath(target)

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

async function main_(
  source: string,
  target: string,
  option: string | Partial<Option> = {}
): Promise<void> {

  await download(...format(source, target, option))
  $.info('download', `downloaded '${source}' to '${target}', as '${$.parseString(option)}'`)
}

// export
export default main_
