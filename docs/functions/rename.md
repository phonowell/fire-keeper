[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / rename

# Function: rename()

> **rename**(`source`, `target`): `Promise`\<`void`\>

Defined in: [rename.ts:17](https://github.com/phonowell/fire-keeper/blob/862cc844119f7a539be35ffaeee5bfb3fdb4b3cd/src/rename.ts#L17)

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
