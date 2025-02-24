[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / recover

# Function: recover()

> **recover**(`source`, `options`): `Promise`\<`void`\>

Defined in: [recover.ts:33](https://github.com/phonowell/fire-keeper/blob/master/src/recover.ts#L33)

Recovers files from their backup versions (.bak files).

## Parameters

### source

A single file path or an array of paths to recover

`string` | `string`[]

### options

`Options` = `{}`

Recovery options

## Returns

`Promise`\<`void`\>

Promise<void>

## Throws

When file operations fail

## Example

```typescript
// Recover a single file
await recover('file.txt')

// Recover multiple files
await recover(['file1.txt', 'file2.txt'])

// Recover files with custom concurrency
await recover('file.txt', { concurrency: 3 })
```
