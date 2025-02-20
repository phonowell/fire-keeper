/*
exec 模块测试用例说明：
1. 执行基本命令（返回退出码和版本信息）
2. 处理命令执行失败（非零退出码）
3. 执行多条命令串联（验证顺序执行和输出）
4. 捕获标准错误输出（包含错误关键字）
5. 处理多行输出（验证输出顺序和内容）
6. 处理不同平台换行符（统一格式）
7. 验证命令分隔符正确性（平台特定分隔符）
8. 静默模式测试（不输出日志）
*/

import { exec, os, at } from '../src'

import { TEMP } from './index'

const testBasicCommand = async () => {
  const [code, result] = await exec('node --version')
  if (code !== 0) throw new Error('command failed')
  if (!/v\d+\.\d+\.\d+/.test(result)) throw new Error('invalid version format')
}
testBasicCommand.description = 'executes basic command'

const testCommandFailure = async () => {
  const [code] = await exec('non-existent-command')
  if (!code) throw new Error('should fail with non-zero code')
}
testCommandFailure.description = 'handles command failure'

const testCommandArray = async () => {
  const commands = [
    `mkdir -p ${TEMP}/exec`,
    `echo "test" > ${TEMP}/exec/test.txt`,
    `cat ${TEMP}/exec/test.txt`,
  ]
  const [code, result] = await exec(commands)
  if (code !== 0) throw new Error('commands failed')
  if (result !== 'test') throw new Error('command output incorrect')
}
testCommandArray.description = 'executes command array'

const testStderrCapture = async () => {
  const command = os() === 'windows' ? 'dir /invalid-flag' : 'ls --invalid-flag'

  const [code, lastOutput, allOutputs] = await exec(command, { silent: true })
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
testStderrCapture.description = 'captures stderr'

const testMultipleOutputs = async () => {
  const commands = ['echo "line1"', 'echo "line2"', 'echo "line3"']
  const [code, lastOutput, allOutputs] = await exec(commands)
  if (code !== 0) throw new Error('commands failed')
  if (allOutputs[0].split('\n').length !== 3)
    throw new Error('wrong number of outputs')
  if (!allOutputs[0].split('\n').every((out, i) => out === `line${i + 1}`))
    throw new Error('output content mismatch')
  if (at(lastOutput.split('\n'), -1) !== 'line3')
    throw new Error('last output incorrect')
}
testMultipleOutputs.description = 'handles multiple outputs'

const testLineEndings = async () => {
  const command =
    os() === 'windows'
      ? 'echo "line1\r\nline2\r\n\r\nline3"'
      : 'printf "line1\\nline2\\n\\nline3\\n"'

  const [code, result] = await exec(command)
  if (code !== 0) throw new Error('command failed')

  const lines = result.split('\n')
  if (lines.length !== 2) throw new Error('line endings not normalized')
  if (lines.join('') !== 'line1line2line3')
    throw new Error('content not preserved')
}
testLineEndings.description = 'handles line endings'

const testCommandSeparators = async () => {
  const commands = ['echo "first"', 'echo "second"']
  const [code, lastOutput, allOutputs] = await exec(commands)
  if (code !== 0) throw new Error('commands failed')
  if (allOutputs[0].split('\n').length !== 2)
    throw new Error('commands not properly separated')
  if (at(lastOutput.split('\n'), -1) !== 'second')
    throw new Error('last output incorrect')
}
testCommandSeparators.description = 'uses OS-specific separators'

const testSilentMode = async () => {
  const originalConsole = console.log
  let loggedMessages = 0
  console.log = () => loggedMessages++

  try {
    await exec('echo "silent test"', { silent: true })
    if (loggedMessages > 0) throw new Error('Logs should be suppressed')

    const [, result] = await exec('echo "non-silent test"')
    if (loggedMessages === 0) throw new Error('Logs should be displayed')
    if (!result.includes('non-silent')) throw new Error('Output mismatch')
  } finally {
    console.log = originalConsole
  }
}
testSilentMode.description = 'suppresses output in silent mode'

export {
  testBasicCommand,
  testCommandFailure,
  testCommandArray,
  testStderrCapture,
  testMultipleOutputs,
  testLineEndings,
  testCommandSeparators,
  testSilentMode,
}
