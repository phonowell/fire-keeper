[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / read

# Function: read()

> **read**\<`T`, `S`, `R`\>(`source`, `options?`): `Promise`\<`undefined` \| `Result`\<`T`, `S`, `R`\>\>

Defined in: [read.ts:53](https://github.com/phonowell/fire-keeper/blob/main/src/read.ts#L53)

Read file contents with smart format detection and parsing

## Type Parameters

### T

`T` = `undefined`

Expected type of parsed content (for type-safe JSON/YAML parsing)

### S

`S` *extends* `string` = `string`

File path string literal type (for extension inference)

### R

`R` *extends* `boolean` = `false`

Whether to return raw buffer (true) or parsed content (false)

## Parameters

### source

`S`

Path to file to read

### options?

`Options`

Read options

## Returns

`Promise`\<`undefined` \| `Result`\<`T`, `S`, `R`\>\>

Parsed content based on file extension:
text→string, json/yaml→object, raw→Buffer, non-existent→undefined
