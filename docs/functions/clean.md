[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / clean

# Function: clean()

> **clean**(`source`): `Promise`\<`void`\>

Defined in: [clean.ts:43](https://github.com/phonowell/fire-keeper/blob/main/src/clean.ts#L43)

Clean up files and directories, removing empty parent directories afterwards.
After removing specified files, checks if their containing directories are empty
and removes them if they are. Directory removal is smart - it won't remove
directories that still contain other files.

## Parameters

### source

The path(s) to clean. Can be:
  - A single file/directory path
  - An array of paths
  - Glob pattern(s)

`string` | `string`[]

## Returns

`Promise`\<`void`\>

Resolves when cleaning is complete. Safe to call on non-existent paths.

## Example

```ts
// Clean single file in empty directory (removes both)
await clean('temp/logs/debug.log')
// temp/logs and temp will be removed if empty

// Clean file with sibling files (keeps directory)
await clean('logs/debug.log')
// Only removes debug.log if other files exist in logs/

// Clean nested structure
await clean([
  'build/temp/cache.txt',
  'build/temp/logs/debug.log'
])
// Removes files and empty parent dirs, preserves dirs with content

// Clean using glob pattern
await clean('dist/*.map')
// Removes all .map files and their empty parent dirs

// Safe with non-existent files
await clean('temp/missing.txt')
// No error if file doesn't exist
```
