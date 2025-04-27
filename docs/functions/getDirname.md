[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / getDirname

# Function: getDirname()

> **getDirname**(`input`): `string`

Defined in: [getDirname.ts:16](https://github.com/phonowell/fire-keeper/blob/main/src/getDirname.ts#L16)

Get directory path from a file path

## Parameters

### input

`string`

File path

## Returns

`string`

Directory path ('.' for current directory)

## Example

```ts
// Basic paths
getDirname('path/to/file.txt') // 'path/to'
getDirname('./config.json') // '.'

// Cross-platform support
getDirname('C:\\path\\file.txt') // 'C:/path'
```
