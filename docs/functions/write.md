[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / write

# Function: write()

> **write**(`source`, `content`, `options`?): `Promise`\<`void`\>

Defined in: [write.ts:54](https://github.com/phonowell/fire-keeper/blob/main/src/write.ts#L54)

Write content to a file with automatic content type handling and path creation.
Supports writing strings, buffers, ArrayBuffers, TypedArrays, Blobs, and objects (auto-stringified).
Creates intermediate directories if they don't exist.

## Parameters

### source

`string`

The path to write to. Will create directories if needed

### content

`unknown`

The content to write. Handled based on type:
  - String/Buffer: Written directly
  - ArrayBuffer/TypedArray: Converted to Uint8Array
  - Blob: Converted to Uint8Array
  - Object: JSON stringified
  - Other: Converted to string

### options?

`WriteFileOptions` = `{}`

fs.writeFile options

## Returns

`Promise`\<`void`\>

## Example

```typescript
// Write string content
await write('file.txt', 'Hello world')

// Write binary data
await write('image.bin', Buffer.from([0xFF, 0x00, 0xFF]))

// Write JSON (auto-stringified)
await write('config.json', {
  port: 3000,
  host: 'localhost'
})

// Write with specific encoding
await write('utf16.txt', 'Content', {
  encoding: 'utf16le'
})

// Write with permissions
await write('script.sh', '#!/bin/sh\necho hello', {
  mode: 0o755  // Executable
})

// Write binary with typed arrays
const array = new Uint8Array([1, 2, 3])
await write('data.bin', array)
```
