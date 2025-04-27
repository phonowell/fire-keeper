[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / getExtname

# Function: getExtname()

> **getExtname**(`input`): `string`

Defined in: [getExtname.ts:17](https://github.com/phonowell/fire-keeper/blob/main/src/getExtname.ts#L17)

Get file extension from a path

## Parameters

### input

`string`

File path

## Returns

`string`

Extension with dot or empty string

## Example

```ts
// Basic usage
getExtname('file.txt') // '.txt'
getExtname('no-extension') // ''

// Special cases
getExtname('.gitignore') // ''
getExtname('bundle.min.js') // '.js'
```
