[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / glob

# Function: glob()

> **glob**(`input`, `options`?): `Promise`\<`ListSource`\>

Defined in: [glob.ts:69](https://github.com/phonowell/fire-keeper/blob/main/src/glob.ts#L69)

Find files and directories using glob patterns with enhanced options and type safety.
Returns paths matching the specified patterns while respecting configuration options.
The result is marked with a special flag to indicate it's a source list.

## Parameters

### input

`string` | `string`[] | `ListSource`

### options?

`Options`

Configuration options

## Returns

`Promise`\<`ListSource`\>

Array of matching paths

## Example

```ts
// Find all JavaScript files
const jsFiles = await glob('src/*.js')

// Multiple patterns
const sources = await glob([
  'src/*.ts',
  'src/*.tsx',
  '!src/*.test.*'  // Exclude test files
])

// Find directories only
const dirs = await glob('src/+([a-z])', {
  onlyDirectories: true
})

// Shallow search with absolute paths
const shallow = await glob('packages/+([a-z])', {
  absolute: true,
  deep: 1
})

// Find all hidden files
const dotFiles = await glob('.*', {
  dot: true,
  onlyFiles: true
})
```
