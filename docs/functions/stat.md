[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / stat

# Function: stat()

> **stat**(`source`): `Promise`\<`null` \| `Stats`\>

Defined in: [stat.ts:26](https://github.com/phonowell/fire-keeper/blob/862cc844119f7a539be35ffaeee5bfb3fdb4b3cd/src/stat.ts#L26)

Get the file status of a file or directory.

## Parameters

### source

`string`

A source file or directory path.

## Returns

`Promise`\<`null` \| `Stats`\>

Promise that resolves with:
         - fs.Stats object if the file exists
         - null if the file is not found

## Throws

If there's an error accessing the file

## Example

```typescript
try {
  const stats = await stat('file.txt')
  if (stats) {
    console.log(`File size: ${stats.size}`)
  }
} catch (err) {
  console.error('Error accessing file:', err)
}
```
