[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / exec

# Function: exec()

> **exec**(`cmd`, `options`): `Promise`\<`Result`\>

Defined in: [exec.ts:43](https://github.com/phonowell/fire-keeper/blob/master/src/exec.ts#L43)

Execute a shell command either synchronously or asynchronously.

## Parameters

### cmd

The command to execute. Can be a single string command or an array of commands.

`string` | `string`[]

### options

`Options` = `{}`

Configuration options for command execution.

## Returns

`Promise`\<`Result`\>

A promise that resolves to a tuple containing:
  - [0]: Exit code (number)
  - [1]: Last output message (string)
  - [2]: Array of all output messages (string[])

## Example

```typescript
// Single command
const [code, last, all] = await exec('echo "Hello, world!"');

// Multiple commands
const [code, last, all] = await exec([
  'npm install',
  'npm run build'
]);

// Silent execution
const [code, last, all] = await exec('git status', { silent: true });
```
