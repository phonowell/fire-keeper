[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / getBasename

# Function: getBasename()

> **getBasename**(`input`): `string`

Defined in: [getBasename.ts:26](https://github.com/phonowell/fire-keeper/blob/862cc844119f7a539be35ffaeee5bfb3fdb4b3cd/src/getBasename.ts#L26)

Extracts the basename (filename without extension) from a file path.

## Parameters

### input

`string`

The file path to process

## Returns

`string`

The basename of the file without extension

## Example

```typescript
// Basic usage
const basename = getBasename('./src/file.txt');
//=> 'file'

// With multiple extensions
const name = getBasename('path/to/script.test.ts');
//=> 'script.test'

// With no extension
const simple = getBasename('documents/notes');
//=> 'notes'

// With absolute path
const abs = getBasename('/usr/local/file.md');
//=> 'file'
```
