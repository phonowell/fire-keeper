[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / isSame

# Function: isSame()

> **isSame**(...`args`): `Promise`\<`boolean`\>

Defined in: [isSame.ts:46](https://github.com/phonowell/fire-keeper/blob/master/src/isSame.ts#L46)

Check if the content of multiple files or paths are identical.

## Parameters

### args

...(`string` \| `string`[])[]

The paths to compare. Can be single paths or arrays of paths

## Returns

`Promise`\<`boolean`\>

A promise that resolves to:
  - `true` if all files have identical content and size
  - `false` if:
    - Less than 2 paths provided
    - Any path doesn't exist
    - Files have zero size
    - Files have different sizes
    - Files have different content

## Example

```typescript
// Basic comparison
const same = await isSame('file1.txt', 'file2.txt');
//=> true if files have identical content

// Multiple files with array
const allSame = await isSame(['config1.json', 'config2.json', 'config3.json']);
//=> true if all files are identical

// Mixed parameter types
const mixed = await isSame('original.txt', ['copy1.txt', 'copy2.txt']);
//=> true if all files match

// Failure cases
const single = await isSame('file.txt');
//=> false (needs at least 2 files)

const nonExistent = await isSame('exists.txt', 'missing.txt');
//=> false (missing file)

const diffSize = await isSame('small.txt', 'large.txt');
//=> false (different file sizes)

const diffContent = await isSame('original.txt', 'modified.txt');
//=> false (different content)
```
