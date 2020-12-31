import child from 'child_process'
import info from './info'
import kleur from 'kleur'
import os from './os'
import trimEnd from 'lodash/trimEnd'

// function

export class M {

  process: child.ChildProcessWithoutNullStreams | undefined

  spawn: typeof child.spawn = child.spawn

  static info(
    type: string,
    message: string
  ): void {

    let msg = message.trim()
    if (!msg) return

    msg = msg
      .replace(/\r/gu, '\n')
      .replace(/\n{2,}/gu, '')

    msg = type === 'error'
      ? kleur.red(msg)
      : kleur.gray(msg)

    console.log(msg)
  }

  static parseMessage(buffer: Uint8Array): string {
    return trimEnd(buffer.toString(), '\n')
  }

  async execute_(
    cmd: string | string[],
    option: {
      ignoreError?: boolean
      silent?: boolean
    } = {}
  ): Promise<[boolean, string]> {

    const stringCmd = cmd instanceof Array
      ? cmd.join(' && ')
      : cmd

    const [cmder, arg] = os() === 'macos'
      ? ['/bin/sh', ['-c', stringCmd]]
      : ['cmd.exe', ['/s', '/c', stringCmd]]

    if (!option.silent)
      info('exec', stringCmd)

    return new Promise(resolve => {

      let result = ''

      this.process = this.spawn(cmder, arg, {})
      this.process.stderr.on('data', (data: Uint8Array) => {
        result = M.parseMessage(data)
        if (!option.silent)
          M.info('error', data.toString())
      })
      this.process.stdout.on('data', (data: Uint8Array) => {
        result = M.parseMessage(data)
        if (!option.silent)
          M.info('default', data.toString())
      })
      this.process.on('close', (code: number) => {
        if (code === 0 || option.ignoreError)
          resolve([true, result])
        resolve([false, result])
      })
    })
  }
}

// export
const m = new M()
export default m.execute_.bind(m)
