[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / mkdir

# Function: mkdir()

> **mkdir**(`source`, `options?`): `Promise`\<`void`\>

Defined in: [mkdir.ts:30](https://github.com/phonowell/fire-keeper/blob/main/src/mkdir.ts#L30)

Create directories recursively with proper permissions.

## Parameters

### source

Directory path(s) to create

`string` | `string`[]

### options?

`Options` = `{}`

Configuration options

## Returns

`Promise`\<`void`\>

Resolves when all directories are created

## Throws

When paths are invalid or permissions deny creation

## Example

```typescript
await mkdir('path/to/deep/dir')
await mkdir(['dir1', 'dir2', 'path/with/特殊字符'])
```
