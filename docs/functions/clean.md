[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / clean

# Function: clean()

> **clean**(`source`): `Promise`\<`void`\>

Defined in: [clean.ts:15](https://github.com/phonowell/fire-keeper/blob/main/src/clean.ts#L15)

Removes files and their empty parent directories

## Parameters

### source

File path(s) or glob pattern(s) to clean

`string` | `string`[]

## Returns

`Promise`\<`void`\>

Promise resolving when cleaning is complete

## Example

```ts
clean('temp/logs/debug.log') // Removes file and empty parents
clean(['build/temp/*.txt']) // Removes matching files
```
