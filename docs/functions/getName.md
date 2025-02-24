[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / getName

# Function: getName()

> **getName**(`input`): `object`

Defined in: [getName.ts:13](https://github.com/phonowell/fire-keeper/blob/main/src/getName.ts#L13)

Get name from path

## Parameters

### input

`string`

string

## Returns

`object`

object

### basename

> **basename**: `string`

### dirname

> **dirname**: `string`

### extname

> **extname**: `string`

### filename

> **filename**: `string`

## Example

```
const name = getName('./src/file.txt')
//=> { basename: 'file', dirname: 'src', extname: '.txt', filename: 'file.txt' }
```
