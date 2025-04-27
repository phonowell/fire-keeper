[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / move

# Function: move()

> **move**(`source`, `target`, `options?`): `Promise`\<`void`\>

Defined in: [move.ts:30](https://github.com/phonowell/fire-keeper/blob/main/src/move.ts#L30)

Move files or directories with copy-then-remove strategy.

## Parameters

### source

Source path(s) to move

`string` | `string`[]

### target

`Dirname`

Target directory or path generator function

### options?

`Options` = `{}`

Configuration options

## Returns

`Promise`\<`void`\>

Resolves when moves complete

## Throws

When target generation fails or disk operations fail

## Example

```typescript
await move('config.json', 'backup/')
await move(['file1.txt', 'file2.txt'], 'archive/')
await move('src/**/*.ts', 'backup/src/')
await move('file.txt', name => `backup/${Date.now()}_${name}`)
```
