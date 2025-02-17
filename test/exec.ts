import { $, temp } from './index'

const a = async () => {
  // Test basic command execution
  const [code, result] = await $.exec('node --version')
  if (code !== 0) throw new Error('command failed')
  if (!/v\d+\.\d+\.\d+/.test(result)) throw new Error('invalid version format')
}
a.description = 'executes basic command'

const b = async () => {
  // Test command failure
  const [code] = await $.exec('non-existent-command')
  if (!code) throw new Error('should fail with non-zero code')
}
b.description = 'handles command failure'

const c = async () => {
  // Test array of commands
  const commands = [
    `mkdir -p ${temp}/exec`,
    `echo "test" > ${temp}/exec/test.txt`,
    `cat ${temp}/exec/test.txt`,
  ]
  const [code, result] = await $.exec(commands)
  if (code !== 0) throw new Error('commands failed')
  if (result !== 'test') throw new Error('command output incorrect')
}
c.description = 'executes command array'

const e = async () => {
  // Test stderr output
  const command =
    $.os() === 'windows' ? 'dir /invalid-flag' : 'ls --invalid-flag'

  const [code, lastOutput, allOutputs] = await $.exec(command, { silent: true })
  if (code === 0) throw new Error('should fail with invalid flag')

  // On Windows or Unix, error messages contain different text
  const errorTerms = ['invalid', 'Invalid', 'bad', 'Bad', 'error', 'Error']
  const hasError = allOutputs.some(out =>
    errorTerms.some(term => out.includes(term)),
  )
  if (!hasError) throw new Error('stderr not captured')

  // Verify lastOutput is actually the last output
  if (lastOutput !== allOutputs[allOutputs.length - 1])
    throw new Error('last output tracking failed')
}
e.description = 'captures stderr'

const f = async () => {
  // Test multiple outputs
  const commands = ['echo "line1"', 'echo "line2"', 'echo "line3"']
  const [code, lastOutput, allOutputs] = await $.exec(commands)
  if (code !== 0) throw new Error('commands failed')
  if (allOutputs[0].split('\n').length !== 3)
    throw new Error('wrong number of outputs')
  if (!allOutputs[0].split('\n').every((out, i) => out === `line${i + 1}`))
    throw new Error('output content mismatch')
  if ($.at(lastOutput.split('\n'), -1) !== 'line3')
    throw new Error('last output incorrect')
}
f.description = 'handles multiple outputs'

const g = async () => {
  // Test line ending handling
  const command =
    $.os() === 'windows'
      ? 'echo "line1\r\nline2\r\n\r\nline3"'
      : 'printf "line1\\nline2\\n\\nline3\\n"'

  const [code, result] = await $.exec(command)
  if (code !== 0) throw new Error('command failed')

  const lines = result.split('\n')
  if (lines.length !== 2) throw new Error('line endings not normalized')
  if (lines.join('') !== 'line1line2line3')
    throw new Error('content not preserved')
}
g.description = 'handles line endings'

const h = async () => {
  // Test OS-specific separators
  const commands = ['echo "first"', 'echo "second"']
  const [code, lastOutput, allOutputs] = await $.exec(commands)
  if (code !== 0) throw new Error('commands failed')
  if (allOutputs[0].split('\n').length !== 2)
    throw new Error('commands not properly separated')
  if ($.at(lastOutput.split('\n'), -1) !== 'second')
    throw new Error('last output incorrect')
}
h.description = 'uses OS-specific separators'

const i = async () => {
  // Test command with environment
  const commands =
    $.os() === 'windows'
      ? [`set "NODE_ENV=test" && node -e "console.log(process.env.NODE_ENV)"`]
      : [`NODE_ENV=test node -e "console.log(process.env.NODE_ENV)"`]
  const [code, result] = await $.exec(commands)
  if (code !== 0) throw new Error('command with env failed')
  if (!result.includes('test')) throw new Error('environment not passed')
}
i.description = 'handles environment variables'

const cleanup = async () => {
  // Cleanup test files
  await $.remove(`${temp}/exec`)
}

export { a, b, c, e, f, g, h, i, cleanup }
