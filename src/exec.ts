import child from 'child_process'

import kleur from 'kleur'
import trimEnd from 'lodash/trimEnd'

import echo from './echo'
import os from './os'

// interface

type Option = {
  silent?: boolean
}

type Result = [number, string, string[]]

// variable

const separator = os() === 'windows' ? ' && ' : '; '

// function

const info = (type: string, message: string) => {
  if (!message) return
  console.log(type === 'error' ? kleur.red(message) : kleur.gray(message))
}

const main = (cmd: string | string[], option: Option = {}) => {
  const stringCmd = cmd instanceof Array ? cmd.join(separator) : cmd

  const [cmder, arg] =
    os() === 'windows'
      ? ['cmd.exe', ['/s', '/c', stringCmd]]
      : ['/bin/sh', ['-c', stringCmd]]

  if (!option.silent) echo('exec', stringCmd)

  return new Promise<Result>(resolve => {
    const cacheAll: string[] = []
    let cacheLast = ''

    const process = child.spawn(cmder, arg, {})

    process.stderr.on('data', (data: Uint8Array) => {
      const message = parseMessage(data)
      cacheAll.push(message)
      cacheLast = message
      if (!option.silent) info('error', message)
    })

    process.stdout.on('data', (data: Uint8Array) => {
      const message = parseMessage(data)
      cacheAll.push(message)
      cacheLast = message
      if (!option.silent) info('default', message)
    })

    process.on('close', (code: number) => resolve([code, cacheLast, cacheAll]))
  })
}

const parseMessage = (buffer: Uint8Array) =>
  trimEnd(buffer.toString().trim(), '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{2,}/g, '')

// export
export default main
