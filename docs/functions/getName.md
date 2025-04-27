[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / getName

# Function: getName()

> **getName**(`input`): `object`

Defined in: [getName.ts:17](https://github.com/phonowell/fire-keeper/blob/main/src/getName.ts#L17)

Parse path into components with cross-platform support

## Parameters

### input

`string`

File path

## Returns

`object`

Path components
  - basename: Name without extension ('file')
  - dirname: Directory path ('path/to')
  - extname: Extension with dot ('.txt')
  - filename: Full name ('file.txt')

### basename

> **basename**: `string`

### dirname

> **dirname**: `string`

### extname

> **extname**: `string`

### filename

> **filename**: `string`

## Example

```ts
getName('path/to/file.txt')
// => { basename: 'file', dirname: 'path/to',
//      extname: '.txt', filename: 'file.txt' }
```
