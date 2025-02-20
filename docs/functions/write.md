[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / write

# Function: write()

> **write**(`source`, `content`, `options`?): `Promise`\<`void`\>

Defined in: [write.ts:42](https://github.com/phonowell/fire-keeper/blob/862cc844119f7a539be35ffaeee5bfb3fdb4b3cd/src/write.ts#L42)

Writes provided content to a specified file.

## Parameters

### source

`string`

The target file where content will be written

### content

`unknown`

The content to be written to the file

### options?

`WriteFileOptions` = `{}`

Optional file system write options

## Returns

`Promise`\<`void`\>

Promise that resolves when write is complete

## Example

```typescript
// Write string content
await write('example.txt', 'Hello World');

// Write Buffer content
await write('binary.dat', Buffer.from([1, 2, 3]));

// Write ArrayBuffer content
const arr = new Uint8Array([65, 66, 67]);
await write('array.bin', arr.buffer);

// Write Blob content
const blob = new Blob(['Hello'], { type: 'text/plain' });
await write('blob.txt', blob);

// Write JSON object (automatically stringified)
await write('config.json', {
  port: 3000,
  host: 'localhost'
});

// Write with options
await write('example.txt', 'content', {
  encoding: 'utf8',
  mode: 0o644
});
```
