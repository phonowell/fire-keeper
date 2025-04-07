[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / remove

# Function: remove()

> **remove**(`source`, `options`?): `Promise`\<`void`\>

Defined in: [remove.ts:47](https://github.com/phonowell/fire-keeper/blob/main/src/remove.ts#L47)

Remove files and directories with concurrent operation support.
Uses glob patterns to match files and supports removing multiple files in parallel.

## Parameters

### source

Path(s) to remove. Can be:
  - Single file/directory path
  - Array of paths
  - Glob pattern(s)

`string` | `string`[]

### options?

`Options` = `{}`

Configuration options

## Returns

`Promise`\<`void`\>

## Example

```typescript
// Remove single file
await remove('temp/file.txt')

// Remove multiple paths
await remove([
  'temp/cache',
  'temp/logs'
])

// Remove using glob patterns
await remove('temp/+(*.js|*.map)')

// Remove with custom concurrency
await remove(['large1.dat', 'large2.dat'], {
  concurrency: 2
})

// Remove directory and its contents
await remove('build')
```
