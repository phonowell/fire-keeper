[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / write

# Function: write()

> **write**(`source`, `content`, `options`): `Promise`\<`void`\>

Defined in: [write.ts:22](https://github.com/phonowell/fire-keeper/blob/main/src/write.ts#L22)

Writes content to a file with path creation and automatic content type handling.

## Parameters

### source

`string`

File path to write to (directories created if needed)

### content

`unknown`

Content to write - handles strings, Buffer, typed arrays, Blob, and objects

### options

`WriteFileOptions` = `{}`

File writing options (encoding, mode, flag)

## Returns

`Promise`\<`void`\>

## Example

```ts
// Write string content
await write('file.txt', 'Hello world')

// Write JSON (auto-stringified)
await write('config.json', { port: 3000 })

// Write binary data with permissions
await write('data.bin', new Uint8Array([1, 2, 3]), { mode: 0o644 })
```
