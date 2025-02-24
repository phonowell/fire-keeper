[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / mkdir

# Function: mkdir()

> **mkdir**(`source`, `options`?): `Promise`\<`void`\>

Defined in: [mkdir.ts:45](https://github.com/phonowell/fire-keeper/blob/main/src/mkdir.ts#L45)

Create one or more directories recursively.

## Parameters

### source

A single directory path or array of directory paths to create

`string` | `string`[]

### options?

`Options` = `{}`

Configuration options

## Returns

`Promise`\<`void`\>

Promise that resolves when all directories are created

## Throws

If:
  - The source is empty
  - Directory creation fails
  - Insufficient permissions

## Example

```typescript
// Create a single directory
await mkdir('path/to/dir');

// Create multiple directories
await mkdir(['path/to/dir1', 'path/to/dir2']);

// Handles nested paths
await mkdir('path/to/nested/dir');

// With custom concurrency
await mkdir(['dir1', 'dir2', 'dir3'], { concurrency: 2 });

// Error handling
try {
  await mkdir('/root/restricted-dir');
} catch (error) {
  console.error('Failed to create directory:', error);
}
```
