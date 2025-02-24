[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / isExist

# Function: isExist()

> **isExist**(...`args`): `Promise`\<`boolean`\>

Defined in: [isExist.ts:42](https://github.com/phonowell/fire-keeper/blob/master/src/isExist.ts#L42)

Check if one or more paths exist in the filesystem.

## Parameters

### args

...(`string` \| `string`[])[]

The paths to check. Can be single paths or arrays of paths

## Returns

`Promise`\<`boolean`\>

A promise that resolves to:
  - `true` if all paths exist
  - `false` if any path doesn't exist or if no paths are provided

## Throws

If any path contains glob patterns (*)

## Example

```typescript
// Single file check
const exists = await isExist('file.txt');
//=> true

// Multiple paths
const allExist = await isExist('config.json', 'data.json');
//=> true if both files exist

// Array of paths
const filesExist = await isExist(['src/index.ts', 'package.json']);
//=> true if all files exist

// Mixed usage
const mixed = await isExist('readme.md', ['src/lib', 'tests']);
//=> true if all paths exist

// Invalid path with glob pattern
await isExist('src/*.ts'); // Throws Error: invalid path 'src/*.ts'

// Empty or invalid input
const empty = await isExist();
//=> false

const invalid = await isExist('');
//=> false
```
