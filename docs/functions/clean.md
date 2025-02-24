[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / clean

# Function: clean()

> **clean**(`source`): `Promise`\<`void`\>

Defined in: [clean.ts:37](https://github.com/phonowell/fire-keeper/blob/main/src/clean.ts#L37)

Clean (remove) files or directories and their empty parent directories.

## Parameters

### source

A file path, directory path, or array of paths to clean

`string` | `string`[]

## Returns

`Promise`\<`void`\>

Promise that resolves when cleaning is complete

## Example

```typescript
// Clean a single file
await clean('dist/bundle.js');

// Clean multiple files
await clean(['temp/cache.txt', 'temp/logs.txt']);

// Clean directory
await clean('build/');

// Clean with glob pattern
await clean('dist/*.js');

// Clean multiple patterns
await clean([
  'dist/*.js',
  'build/*.map'
]);

// Parent directory cleanup
// If temp/data/file.txt is the last file,
// temp/data will also be removed if empty
await clean('temp/data/file.txt');
```
