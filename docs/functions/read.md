[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / read

# Function: read()

> **read**\<`T`, `S`, `R`\>(`source`, `options`?): `Promise`\<`undefined` \| `Result`\<`T`, `S`, `R`\>\>

Defined in: [read.ts:81](https://github.com/phonowell/fire-keeper/blob/862cc844119f7a539be35ffaeee5bfb3fdb4b3cd/src/read.ts#L81)

Read a file with automatic content parsing based on file extension.

## Type Parameters

• **T** = `undefined`

• **S** *extends* `string` = `string`

• **R** *extends* `boolean` = `false`

## Parameters

### source

`S`

The path to the file to read

### options?

`Options`

Reading options

## Returns

`Promise`\<`undefined` \| `Result`\<`T`, `S`, `R`\>\>

Promise that resolves to:
  - Parsed JSON for .json files
  - Parsed YAML for .yaml/.yml files
  - String content for text-based files (.txt, .md, .ts, etc.)
  - Raw buffer for other file types
  - undefined if file doesn't exist

## Example

```typescript
// Read text file
const text = await read('readme.md');
//=> string content

// Read JSON file with type inference
const config = await read('tsconfig.json');
//=> parsed JSON object

// Read YAML file
const data = await read('config.yml');
//=> parsed YAML object

// Read binary file in raw mode
const buffer = await read('image.png', { raw: true });
//=> Buffer

// Handle non-existent file
const missing = await read('not-found.txt');
//=> undefined

// With type parameters
interface Config { port: number }
const config = await read<Config>('config.json');
//=> { port: number }
```
