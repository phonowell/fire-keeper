[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / normalizePath

# Function: normalizePath()

> **normalizePath**(`input`): `string`

Defined in: [normalizePath.ts:22](https://github.com/phonowell/fire-keeper/blob/main/src/normalizePath.ts#L22)

Normalizes file system paths with special case handling

## Parameters

### input

`string`

Path string to normalize

## Returns

`string`

Normalized absolute path string, or empty string for invalid inputs

## Example

```ts
normalizePath('./src/file.txt') //=> '/home/project/src/file.txt'
normalizePath('~/documents') //=> '/home/user/documents'
normalizePath('!./ignored') //=> '!/home/project/ignored'
normalizePath('../config') //=> '/home/config'
normalizePath('./测试/路径') //=> '/home/project/测试/路径'
normalizePath('') //=> ''
```
