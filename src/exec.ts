import child from 'node:child_process'

import ansis from 'ansis'

import echo from './echo.js'
import os from './os.js'

type Options = {
  echo?: boolean
  silent?: boolean
}

export type Result = [number, string, string[]]

const getCommandString = (cmd: string | string[]) => {
  const commands = Array.isArray(cmd) ? cmd : [cmd]
  if (!commands.length) return ''
  if (commands.length === 1) return commands[0]

  if (os() === 'windows') {
    return commands
      .map(
        (command) =>
          `${command}; if (-not $?) { if ($LASTEXITCODE) { exit $LASTEXITCODE }; exit 1 }`,
      )
      .join(' ')
  }

  return commands.join(' && ')
}

/**
 * Cross-platform shell command execution with output capture
 * @param {string | string[]} cmd - Single command or array of commands
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.silent] - Suppress command output logging
 * @param {boolean} [options.echo] - Suppress the command echo line
 * @returns {Promise<[number, string, string[]]>} [exitCode, lastOutput, allOutputs]
 *
 * @example
 * // Multiple commands execute in order and stop on first failure
 * await exec(['mkdir dist', 'tsc', 'node dist/index.js'])
 *
 * // Silent background task
 * await exec('npm install', { silent: true })
 */
const exec = (
  cmd: string | string[],
  { echo: shouldEcho = true, silent = false }: Options = {},
): Promise<Result> => {
  const command = getCommandString(cmd)
  if (!command) return Promise.resolve([0, '', []])

  if (!silent && shouldEcho) echo('exec', Array.isArray(cmd) ? cmd.join(' && ') : cmd)

  return executeCommand(command, silent)
}

const executeCommand = (command: string, silent: boolean): Promise<Result> => {
  const [cmder, arg] =
    os() === 'windows'
      ? [
          'powershell.exe',
          [
            '-NoProfile',
            '-Command',
            `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; ${command}`,
          ],
        ]
      : ['/bin/sh', ['-c', command]]

  return new Promise<Result>((resolve) => {
    const cacheAll: string[] = []
    let cacheLast = ''

    const onData = (type: 'default' | 'error') => (data: Uint8Array) => {
      const message = parseMessage(data)
      cacheAll.push(message)
      cacheLast = message
      if (!silent) info(type, message)
    }

    const spawnOptions = os() === 'windows' ? { shell: false } : {}
    const proc = child.spawn(cmder, arg, spawnOptions)

    proc.stderr.on('data', onData('error'))
    proc.stdout.on('data', onData('default'))

    proc.on('error', (error) => {
      const message = error.message.trim()
      if (message) {
        cacheAll.push(message)
        cacheLast = message
        if (!silent) info('error', message)
      }

      resolve([1, cacheLast, cacheAll])
    })

    proc.on('close', (code: number | null) => resolve([code ?? 1, cacheLast, cacheAll]))
  })
}

const info = (type: string, message: string) => {
  if (!message) return
  console.log(type === 'error' ? ansis.red(message) : ansis.gray(message))
}

const parseMessage = (buffer: Uint8Array) =>
  buffer
    .toString()
    .trim()
    .replace(/\r/g, '\n')
    .replace(/\n{2,}/g, '\n')

export default exec
