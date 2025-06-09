[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / normalizePath

# Function: normalizePath()

> **normalizePath**(`input`): `string`

Defined in: [normalizePath.ts:17](https://github.com/phonowell/fire-keeper/blob/main/src/normalizePath.ts#L17)

Normalizes file system paths to absolute paths with special handling

## Parameters

### input

`string`

Path string to normalize (supports ~, ./, ../, and ! prefix)

## Returns

`string`

Normalized absolute path, empty string for invalid inputs

## Example

```ts
normalizePath('./src') // => '/project/src'
normalizePath('~/docs') // => '/home/user/docs'
normalizePath('!./ignore') // => '!/project/ignore'
```
