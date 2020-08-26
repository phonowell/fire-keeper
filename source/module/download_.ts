import $ from '..'
import download from 'download'

// interface

interface IOption {
  filename: string
  timeout: number
}

// function

function format(
  source: string,
  target: string,
  option: string | Partial<IOption>
): [string, string, IOption] {

  if (!source) throw new Error('download_/error: empty source')
  if (source.startsWith('//'))
    source = `https:${source}`

  if (!target) throw new Error('download_/error: empty target')
  target = $.normalizePath(target)

  if (typeof option === 'string')
    option = { filename: option }
  const optionX = Object.assign({
    filename: '',
    timeout: 10e3
  }, option)

  return [source, target, optionX]
}

async function main_(
  source: string,
  target: string,
  option: string | Partial<IOption> = {}
): Promise<void> {

  await download.call(null, ...format(source, target, option))
  $.info('download', `downloaded '${source}' to '${target}', as '${$.parseString(option)}'`)
}

// export
export default main_