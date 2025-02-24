[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / getDirname

# Function: getDirname()

> **getDirname**(`input`): `string`

Defined in: [getDirname.ts:26](https://github.com/phonowell/fire-keeper/blob/main/src/getDirname.ts#L26)

Extracts the directory name from a file path.

## Parameters

### input

`string`

The file path to process

## Returns

`string`

The directory name component of the path

## Example

```typescript
// Basic usage with relative path
const dirname = getDirname('./src/file.txt');
//=> 'src'

// With absolute path
const root = getDirname('/usr/local/bin/app');
//=> '/usr/local/bin'

// With nested directories
const nested = getDirname('project/src/components/Button.tsx');
//=> 'project/src/components'

// Current directory
const current = getDirname('./config.json');
//=> '.'
```
