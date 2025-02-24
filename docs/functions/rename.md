[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / rename

# Function: rename()

> **rename**(`source`, `target`): `Promise`\<`void`\>

Defined in: [rename.ts:17](https://github.com/phonowell/fire-keeper/blob/main/src/rename.ts#L17)

Rename a file or directory.

## Parameters

### source

`string`

A source file or directory.

### target

`string`

A target file or directory.

## Returns

`Promise`\<`void`\>

The promise.

## Example

```
await rename('file.txt', 'file.bak')
```
