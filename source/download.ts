import download from 'download'
import log from './log'
import normalizePath from './normalizePath'
import toString from './toString'

// interface

interface Options {
  filename: string
  timeout: number
}

// function

const format = (
  source: string,
  target: string,
  options: string | Partial<Options>
) => {
  if (!source) throw new Error('download/error: empty source')
  const url = source.startsWith('//') ? `https:${source}` : source

  if (!target) throw new Error('download/error: empty target')
  const path = normalizePath(target)

  const options2: Options = {
    filename: '',
    timeout: 10e3,
    ...(typeof options === 'string' ? { filename: options } : { ...options }),
  }

  return [url, path, options2] as const
}

const main = async (
  source: string,
  target: string,
  option: string | Partial<Options> = {}
) => {
  await download(...format(source, target, option))
  log(
    'download',
    `downloaded '${source}' to '${target}', as '${toString(option)}'`
  )
}

// export
export type { Options }
export default main
