import $info from './info'
import $os from './os'
import _trimEnd from 'lodash/trimEnd'
import child from 'child_process'
import kleur from 'kleur'

// interface

type Option = {
  ignoreError?: boolean
  silent?: boolean
}

type Result = [boolean, string]

// variable

const separator = $os() === 'windows'
  ? ' && '
  : '; '

// function

const info = (
  type: string,
  message: string,
): void => {

  let msg = message.trim()
  if (!msg) return

  msg = msg
    .replace(/\r/g, '\n')
    .replace(/\n{2,}/g, '')

  msg = type === 'error'
    ? kleur.red(msg)
    : kleur.gray(msg)

  console.log(msg)
}

const main = (
  cmd: string | string[],
  option: Option = {},
): Promise<Result> => {

  const stringCmd = cmd instanceof Array
    ? cmd.join(separator)
    : cmd

  const [cmder, arg] = $os('macos')
    ? ['/bin/sh', ['-c', stringCmd]]
    : ['cmd.exe', ['/s', '/c', stringCmd]]

  if (!option.silent) $info('exec', stringCmd)

  return new Promise(resolve => {

    let result = ''

    const process = child.spawn(cmder, arg, {})

    process.stderr.on('data', (data: Uint8Array) => {
      result = parseMessage(data)
      if (!option.silent) info('error', data.toString())
    })

    process.stdout.on('data', (data: Uint8Array) => {
      result = parseMessage(data)
      if (!option.silent) info('default', data.toString())
    })

    process.on('close', (code: number) => {
      if (code === 0 || option.ignoreError) resolve([true, result])
      resolve([false, result])
    })
  })
}

const parseMessage = (
  buffer: Uint8Array,
): string => _trimEnd(buffer.toString(), '\n')

// export
export default main