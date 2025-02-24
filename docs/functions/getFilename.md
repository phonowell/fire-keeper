[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / getFilename

# Function: getFilename()

> **getFilename**(`input`): `string`

Defined in: [getFilename.ts:26](https://github.com/phonowell/fire-keeper/blob/master/src/getFilename.ts#L26)

Extracts the filename (with extension) from a file path.

## Parameters

### input

`string`

The file path to process

## Returns

`string`

The filename including extension

## Example

```typescript
// Basic usage
const filename = getFilename('./src/file.txt');
//=> 'file.txt'

// With multiple extensions
const test = getFilename('path/to/script.test.ts');
//=> 'script.test.ts'

// Hidden file
const hidden = getFilename('/path/.gitignore');
//=> '.gitignore'

// File without extension
const noExt = getFilename('docs/README');
//=> 'README'
```
