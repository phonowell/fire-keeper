[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / stat

# Function: stat()

> **stat**(`source`): `Promise`\<`null` \| `Stats`\>

Defined in: [stat.ts:24](https://github.com/phonowell/fire-keeper/blob/main/src/stat.ts#L24)

Get the file status of a file, directory, or glob pattern.

## Parameters

### source

`string`

A file path, directory path, or glob pattern.

## Returns

`Promise`\<`null` \| `Stats`\>

Promise that resolves with:
         - fs.Stats object if the file exists (resolves symlinks)
         - null if the file is not found

## Throws

If there's an error accessing the file (e.g., invalid input)

## Example

```
const stats = await stat('file.txt')
if (stats?.isFile()) console.log(`Size: ${stats.size}`)

// Also works with directories and glob patterns
const dirStats = await stat('directory')
const fileStats = await stat('src/*.ts')
```
