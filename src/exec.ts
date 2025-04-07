import child from 'child_process'

import kleur from 'kleur'

import echo from './echo'
import os from './os'
import trimEnd from './trimEnd'

type Options = {
  silent?: boolean
}

type Result = [number, string, string[]]

// variable

const separator = os() === 'windows' ? ' && ' : '; '

/**
 * Execute shell commands with output capture and error handling.
 * Commands are executed sequentially when provided as an array.
 *
 * @param {string | string[]} cmd - A single command string or array of command strings to execute
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.silent=false] - If true, suppresses command output logging
 *
 * @returns {Promise<[number, string, string[]]>} A promise that resolves to a tuple containing:
 *   - [0]: Exit code (number) - 0 for success, non-zero for failure
 *   - [1]: Last output message (string)
 *   - [2]: Array of all output messages (string[])
 *
 * @example
 * // Single command execution
 * const [code, last, all] = await exec('echo "Hello"')
 * console.log('Exit code:', code)     // 0
 * console.log('Last output:', last)   // "Hello"
 *
 * // Multiple commands in sequence
 * const [code] = await exec([
 *   'mkdir -p temp',
 *   'echo "test" > temp/test.txt',
 *   'cat temp/test.txt'
 * ])
 *
 * // Silent execution
 * await exec('npm install', { silent: true })
 *
 * // Error handling
 * const [code] = await exec('invalid-command')
 * if (code !== 0) {
 *   console.error('Command failed')
 * }
 */
const exec = (
  cmd: string | string[],
  { silent = false }: Options = {},
): Promise<Result> => {
  const stringCmd = cmd instanceof Array ? cmd.join(separator) : cmd

  const [cmder, arg] =
    os() === 'windows'
      ? ['cmd.exe', ['/s', '/c', stringCmd]]
      : ['/bin/sh', ['-c', stringCmd]]

  if (!silent) echo('exec', stringCmd)

  return new Promise<Result>((resolve) => {
    const cacheAll: string[] = []
    let cacheLast = ''

    const process = child.spawn(cmder, arg, {})

    process.stderr.on('data', (data: Uint8Array) => {
      const message = parseMessage(data)
      cacheAll.push(message)
      cacheLast = message
      if (!silent) info('error', message)
    })

    process.stdout.on('data', (data: Uint8Array) => {
      const message = parseMessage(data)
      cacheAll.push(message)
      cacheLast = message
      if (!silent) info('default', message)
    })

    process.on('close', (code: number) => resolve([code, cacheLast, cacheAll]))
  })
}

const info = (type: string, message: string) => {
  if (!message) return
  console.log(type === 'error' ? kleur.red(message) : kleur.gray(message))
}

const parseMessage = (buffer: Uint8Array) =>
  trimEnd(buffer.toString().trim(), '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{2,}/g, '')

export default exec
