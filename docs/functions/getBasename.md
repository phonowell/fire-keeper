[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / getBasename

# Function: getBasename()

> **getBasename**(`input`): `string`

Defined in: [getBasename.ts:16](https://github.com/phonowell/fire-keeper/blob/main/src/getBasename.ts#L16)

Get filename without extension from a path

## Parameters

### input

`string`

File path

## Returns

`string`

Basename without extension

## Example

```ts
// Regular paths
getBasename('path/to/file.txt') // 'file'
getBasename('script.test.ts') // 'script.test'

// Special cases
getBasename('.gitignore') // '.gitignore'
```
