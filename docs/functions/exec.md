[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / exec

# Function: exec()

> **exec**(`cmd`, `options?`): `Promise`\<`Result`\>

Defined in: [exec.ts:31](https://github.com/phonowell/fire-keeper/blob/main/src/exec.ts#L31)

Cross-platform shell command execution with output capture

## Parameters

### cmd

Single command or array of commands

`string` | `string`[]

### options?

`Options` = `{}`

Configuration options

## Returns

`Promise`\<`Result`\>

[exitCode, lastOutput, allOutputs]

## Example

```ts
// Multiple commands (uses && on Windows, ; on Unix)
await exec(['mkdir dist', 'tsc', 'node dist/index.js'])

// Silent background task
await exec('npm install', { silent: true })
```
