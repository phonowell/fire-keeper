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
 * Supports cross-platform command execution with unified output formatting.
 *
 * @param {string | string[]} cmd - A single command string or array of command strings to execute
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.silent=false] - If true, suppresses command output logging
 *
 * @returns {Promise<[number, string, string[]]>} A promise that resolves to a tuple containing:
 *   - [0]: Exit code (number) - 0 for success, non-zero for failure
 *   - [1]: Last output message (string) - Cleaned and normalized
 *   - [2]: Array of all output messages (string[]) - Complete history
 *
 * @example
 * // Single command with error handling
 * const [code, last, all] = await exec('npm test')
 * if (code !== 0) {
 *   console.error('Tests failed:', last)
 * }
 *
 * // Multiple commands with platform-specific separators
 * await exec([
 *   'mkdir -p dist',
 *   'tsc',
 *   'node dist/index.js'
 * ]) // Uses && on Windows, ; on Unix
 *
 * // Capture all output history
 * const [code, last, all] = await exec('ls -R')
 * console.log('Last file:', last)
 * console.log('All files:', all.join('\n'))
 *
 * // Silent execution for background tasks
 * await exec('npm install', { silent: true })
 *
 * // Error output handling (shown in red)
 * await exec('invalid-cmd') // Errors in red text
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
