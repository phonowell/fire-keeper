[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / getExtname

# Function: getExtname()

> **getExtname**(`input`): `string`

Defined in: [getExtname.ts:26](https://github.com/phonowell/fire-keeper/blob/862cc844119f7a539be35ffaeee5bfb3fdb4b3cd/src/getExtname.ts#L26)

Extracts the file extension from a path string.

## Parameters

### input

`string`

The file path to process

## Returns

`string`

The file extension including the leading dot, or empty string if no extension

## Example

```typescript
// Basic usage
const extname = getExtname('./src/file.txt');
//=> '.txt'

// With multiple extensions
const test = getExtname('script.test.ts');
//=> '.ts'

// No extension
const none = getExtname('README');
//=> ''

// Hidden file
const hidden = getExtname('.gitignore');
//=> ''
```
