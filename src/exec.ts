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
 * Execute a shell command either synchronously or asynchronously.
 * @param cmd - The command to execute. Can be a single string command or an array of commands.
 * @param options - Configuration options for command execution.
 * @param {boolean} [option.silent=false] - If true, suppresses command output logging.
 * @returns {Promise<[number, string, string[]]>} A promise that resolves to a tuple containing:
 *   - [0]: Exit code (number)
 *   - [1]: Last output message (string)
 *   - [2]: Array of all output messages (string[])
 * @example
 * ```typescript
 * // Single command
 * const [code, last, all] = await exec('echo "Hello, world!"');
 *
 * // Multiple commands
 * const [code, last, all] = await exec([
 *   'npm install',
 *   'npm run build'
 * ]);
 *
 * // Silent execution
 * const [code, last, all] = await exec('git status', { silent: true });
 * ```
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
