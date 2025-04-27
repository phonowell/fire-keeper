[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / rename

# Function: rename()

> **rename**(`source`, `target`): `Promise`\<`void`\>

Defined in: [rename.ts:21](https://github.com/phonowell/fire-keeper/blob/main/src/rename.ts#L21)

Rename a file or directory with path normalization

## Parameters

### source

`string`

Source path to rename (file, directory, or symlink)

### target

`string`

New name (not full path) for the source

## Returns

`Promise`\<`void`\>

Resolves when rename completes

## Example

```ts
rename('file.txt', 'backup.txt')
rename('src/', 'backup-src') // Preserves directory contents
```

## Throws

ENOENT (not found), EEXIST (target exists), EPERM (permission denied)
