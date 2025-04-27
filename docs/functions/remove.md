[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / remove

# Function: remove()

> **remove**(`source`, `options?`): `Promise`\<`void`\>

Defined in: [remove.ts:25](https://github.com/phonowell/fire-keeper/blob/main/src/remove.ts#L25)

Removes files and directories with pattern matching support

## Parameters

### source

Path(s) to remove, can be files, directories, or glob patterns

`string` | `string`[]

### options?

`Options` = `{}`

Configuration options

## Returns

`Promise`\<`void`\>

Resolves when all removals complete

## Example

```ts
remove('temp/file.txt')
remove(['logs/error.log', 'cache/'], { concurrency: 3 })
```
