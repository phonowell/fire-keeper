[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / read

# Function: read()

> **read**\<`T`, `S`, `R`\>(`source`, `options`?): `Promise`\<`undefined` \| `Result`\<`T`, `S`, `R`\>\>

Defined in: [read.ts:85](https://github.com/phonowell/fire-keeper/blob/main/src/read.ts#L85)

Read file contents with automatic format detection and parsing based on file extension.
Handles text, JSON, YAML, and binary files with appropriate parsing.

## Type Parameters

### T

`T` = `undefined`

Expected type of the parsed content (for JSON/YAML files)

### S

`S` *extends* `string` = `string`

File path string literal type (for extension inference)

### R

`R` *extends* `boolean` = `false`

Whether to return raw buffer (true) or parsed content (false)

## Parameters

### source

`S`

Path to the file to read

### options?

`Options`

Read options

## Returns

`Promise`\<`undefined` \| `Result`\<`T`, `S`, `R`\>\>

File contents or undefined if file doesn't exist:
  - Text files (.txt, .md, etc): String content
  - JSON files: Parsed object
  - YAML/YML files: Parsed object
  - With raw=true: Buffer
  - Non-existent file: undefined

## Example

```ts
// Text file - returns string
const text = await read('readme.md')

// JSON with type safety
interface Config {
  port: number
  host: string
}
const config = await read<Config>('config.json')

// YAML/YML files
const data = await read('config.yml')

// Binary files
const buffer = await read('image.png', { raw: true })

// Non-existent file
const missing = await read('not-found.txt')  // undefined

// Empty file
const empty = await read('empty.txt')  // returns ""
const emptyRaw = await read('empty.txt', { raw: true })  // returns empty Buffer
```
