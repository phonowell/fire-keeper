[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / getFilename

# Function: getFilename()

> **getFilename**(`input`): `string`

Defined in: [getFilename.ts:17](https://github.com/phonowell/fire-keeper/blob/main/src/getFilename.ts#L17)

Get filename with extension from a path

## Parameters

### input

`string`

File path

## Returns

`string`

Full filename with extension

## Example

```ts
// Basic paths
getFilename('path/to/file.txt') // 'file.txt'
getFilename('script.test.js') // 'script.test.js'

// Special paths
getFilename('path/to/dir/') // 'dir'
getFilename('.gitignore') // '.gitignore'
```
