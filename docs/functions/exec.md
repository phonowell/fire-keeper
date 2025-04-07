[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / exec

# Function: exec()

> **exec**(`cmd`, `options`?): `Promise`\<`Result`\>

Defined in: [exec.ts:54](https://github.com/phonowell/fire-keeper/blob/main/src/exec.ts#L54)

Execute shell commands with output capture and error handling.
Commands are executed sequentially when provided as an array.

## Parameters

### cmd

A single command string or array of command strings to execute

`string` | `string`[]

### options?

`Options` = `{}`

Configuration options

## Returns

`Promise`\<`Result`\>

A promise that resolves to a tuple containing:
  - [0]: Exit code (number) - 0 for success, non-zero for failure
  - [1]: Last output message (string)
  - [2]: Array of all output messages (string[])

## Example

```ts
// Single command execution
const [code, last, all] = await exec('echo "Hello"')
console.log('Exit code:', code)     // 0
console.log('Last output:', last)   // "Hello"

// Multiple commands in sequence
const [code] = await exec([
  'mkdir -p temp',
  'echo "test" > temp/test.txt',
  'cat temp/test.txt'
])

// Silent execution
await exec('npm install', { silent: true })

// Error handling
const [code] = await exec('invalid-command')
if (code !== 0) {
  console.error('Command failed')
}
```
