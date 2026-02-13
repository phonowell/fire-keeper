import child from 'child_process'

import kleur from 'kleur'

import echo from './echo.js'
import os from './os.js'

type Options = {
  echo?: boolean
  silent?: boolean
}

export type Result = [number, string, string[]]

const SEPARATOR = os() === 'windows' ? '; ' : '; '

/**
 * Cross-platform shell command execution with output capture
 * @param {string | string[]} cmd - Single command or array of commands
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.silent] - Suppress command output logging
 * @returns {Promise<[number, string, string[]]>} [exitCode, lastOutput, allOutputs]
 *
 * @example
 * // Multiple commands (uses && on Windows, ; on Unix)
 * await exec(['mkdir dist', 'tsc', 'node dist/index.js'])
 *
 * // Silent background task
 * await exec('npm install', { silent: true })
 */
const exec = (
  cmd: string | string[],
  { echo: shouldEcho = true, silent = false }: Options = {},
): Promise<Result> => {
  const stringCmd = cmd instanceof Array ? cmd.join(SEPARATOR) : cmd

  const [cmder, arg] =
    os() === 'windows'
      ? [
          'powershell.exe',
          [
            '-NoProfile',
            '-Command',
            `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; ${stringCmd}`,
          ],
        ]
      : ['/bin/sh', ['-c', stringCmd]]

  if (!silent && shouldEcho) echo('exec', stringCmd)

  return new Promise<Result>((resolve) => {
    const cacheAll: string[] = []
    let cacheLast = ''

    const spawnOptions = os() === 'windows' ? { shell: false } : {}

    const process = child.spawn(cmder, arg, spawnOptions)

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
  buffer
    .toString()
    .trim()
    .replace(/\r/g, '\n')
    .replace(/\n{2,}/g, '\n')

export default exec
