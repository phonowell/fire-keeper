[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / zip

# Function: zip()

> **zip**(`source`, `target`, `option`): `Promise`\<`void`\>

Defined in: [zip.ts:125](https://github.com/phonowell/fire-keeper/blob/862cc844119f7a539be35ffaeee5bfb3fdb4b3cd/src/zip.ts#L125)

Zip the source to the target.

## Parameters

### source

The source file or directory.

`string` | `string`[]

### target

`string` = `''`

The target directory.

### option

The option.

`string` | `Options`

## Returns

`Promise`\<`void`\>

## Example

```
zip('src', 'dist', 'archive.zip')
zip('src', 'dist', { base: 'src', filename: 'archive.zip' })
zip(['src', 'public'], 'dist', 'archive.zip')
zip(['src', 'public'], 'dist', { base: 'src', filename: 'archive.zip' })
```
