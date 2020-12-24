import $ from '..'
import child from 'child_process'
import kleur from 'kleur'
import trimEnd from 'lodash/trimEnd'

// function

class M {

  process: child.ChildProcessWithoutNullStreams | undefined
  spawn: typeof child.spawn = child.spawn

  close(): void {
    if (!this.process) return
    this.process.kill()
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

    const [cmder, arg] = $.os() === 'macos'
      ? ['/bin/sh', ['-c', stringCmd]]
      : ['cmd.exe', ['/s', '/c', stringCmd]]

    if (!option.silent)
      $.info('exec', stringCmd)

    return await new Promise(resolve => {

      let result = ''

      this.process = this.spawn(cmder, arg, {})
      this.process.stderr.on('data', (data: Uint8Array) => {
        result = this.parseMessage(data)
        if (!option.silent)
          this.info('error', data.toString())
      })
      this.process.stdout.on('data', (data: Uint8Array) => {
        result = this.parseMessage(data)
        if (!option.silent)
          this.info('default', data.toString())
      })
      this.process.on('close', (code: number) => {
        if (code === 0 || option.ignoreError)
          resolve([true, result])
        resolve([false, result])
      })
    })
  }

  info(type: string, message: string): void {

    message = message.trim()
    if (!message) return

    message = message
      .replace(/\r/g, '\n')
      .replace(/\n{2,}/g, '')

    message = type === 'error'
      ? kleur.red(message)
      : kleur.gray(message)

    console.log(message)
  }

  parseMessage(buffer: Uint8Array): string {
    return trimEnd(buffer.toString(), '\n')
  }
}

// export
const m = new M()
export default m.execute_.bind(m) as typeof m.execute_