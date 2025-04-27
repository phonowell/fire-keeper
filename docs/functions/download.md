[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / download

# Function: download()

> **download**(`url`, `dir`, `filename?`): `Promise`\<`void`\>

Defined in: [download.ts:22](https://github.com/phonowell/fire-keeper/blob/main/src/download.ts#L22)

Downloads file from URL using stream processing
- Auto-creates target directory if missing
- Supports binary files and Unicode filenames
- Normalizes directory paths

## Parameters

### url

`string`

URL to download from

### dir

`string`

Target directory path

### filename?

`string` = `...`

Optional custom filename, defaults to URL filename

## Returns

`Promise`\<`void`\>

## Throws

Invalid URL or directory

## Throws

Network errors, non-200 responses, empty bodies, I/O failures
