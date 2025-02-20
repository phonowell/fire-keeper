[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / move

# Function: move()

> **move**(`source`, `target`, `options`?): `Promise`\<`void`\>

Defined in: [move.ts:42](https://github.com/phonowell/fire-keeper/blob/862cc844119f7a539be35ffaeee5bfb3fdb4b3cd/src/move.ts#L42)

Move files or directories.

## Parameters

### source

The source file/directory path or array of paths to move

`string` | `string`[]

### target

`Dirname`

The target directory or a function that returns the target path

### options?

`Options` = `{}`

Configuration options

## Returns

`Promise`\<`void`\>

Promise that resolves when all moves are complete

## Throws

If source doesn't exist or target is invalid

## Example

```typescript
// Move a single file
await move('file.txt', 'backup');

// Move multiple files
await move(['file1.txt', 'file2.txt'], 'backup');

// Using a function to generate target path
await move('file.txt', name => `backup/${name}`);

// With custom concurrency
await move(['file1.txt', 'file2.txt'], 'backup', {
  concurrency: 2
});

// Error handling
try {
  await move('nonexistent.txt', 'backup');
} catch (error) {
  console.error('Move failed:', error);
}
```
