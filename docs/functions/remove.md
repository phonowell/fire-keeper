[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / remove

# Function: remove()

> **remove**(`source`, `options`): `Promise`\<`void`\>

Defined in: [remove.ts:41](https://github.com/phonowell/fire-keeper/blob/master/src/remove.ts#L41)

Remove files or directories recursively.

## Parameters

### source

A file/directory path or array of paths to remove.

`string` | `string`[]

### options

`Options` = `{}`

Configuration options for removal.

## Returns

`Promise`\<`void`\>

Promise that resolves when all files are removed.

## Throws

If a file/directory cannot be accessed or removed.

## Throws

If source parameter is invalid.

## Examples

```typescript
await remove('file.txt')
```

```typescript
await remove(['file1.txt', 'file2.txt'], { concurrency: 3 })
```

```typescript
await remove('directory/to/remove')
```

```typescript
await remove('temp/*.log')
```
