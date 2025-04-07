[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / copy

# Function: copy()

> **copy**(`source`, `target`?, `options`?): `Promise`\<`void`\>

Defined in: [copy.ts:77](https://github.com/phonowell/fire-keeper/blob/main/src/copy.ts#L77)

Copy files and directories with support for concurrent operations and flexible naming.
Handles multiple files, glob patterns, and provides customization options for target paths and filenames.
Includes smart path handling and performance optimizations for large-scale operations.

## Parameters

### source

Source file(s) or directory path(s). Can be:
  - A single path
  - An array of paths
  - Glob pattern(s)

`string` | `string`[]

### target?

`Dirname`

Target directory or transform function:
  - If undefined: Creates copy in same directory with '.copy' suffix
  - If empty string (''):  Uses current directory
  - If string: Copies to specified directory path (supports ~/ for home dir)
  - If function: Dynamically generates target path (can be async)

### options?

Configuration options:
  - If string: Used as target filename
  - If function: Generates target filename (can be async)
  - If object: Advanced options object

`Dirname` | `Options`

## Returns

`Promise`\<`void`\>

Resolves when all copy operations are complete

## Example

```ts
// Basic copy with smart naming
await copy('source.txt')                // creates source.copy.txt in same dir
await copy('source.txt', 'target')      // creates target/source.txt

// Advanced path handling
await copy('file.txt', '')              // copy to current directory
await copy('file.txt', '~/backup')      // copy to home directory (macOS/Linux)
await copy(['a.txt', 'b.txt'], 'dist')  // copy multiple files

// Dynamic paths with async functions
await copy('data.txt', async dirname => {
  const timestamp = await getTimestamp()
  return `backup/${timestamp}`
})

// Custom naming with type preservation
await copy('src/*.ts', 'dist', {
  filename: name => name.replace('.ts', '.js'),
})

// Large-scale operations with concurrency control
await copy('assets/*.png', 'dist', {
  concurrency: 3,  // limit concurrent operations
})

// Mixed patterns with glob
await copy([
  'src/*.js',
  'src/*.ts',
  '!src/*.test.ts',  // exclude test files
], 'dist')
```
