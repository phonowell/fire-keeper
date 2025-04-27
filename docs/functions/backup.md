[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / backup

# Function: backup()

> **backup**(`source`, `options`): `Promise`\<`void`\>

Defined in: [backup.ts:20](https://github.com/phonowell/fire-keeper/blob/main/src/backup.ts#L20)

Creates .bak copies of specified files in their original directories

## Parameters

### source

File path(s) or glob pattern(s) to backup

`string` | `string`[]

### options

`Options` = `{}`

Backup configuration

## Returns

`Promise`\<`void`\>

## Throws

If backup operations fail

## Example

```ts
backup('file.txt') // Creates file.txt.bak
backup(['src/*.ts'], { concurrency: 2 }) // Backs up 2 files at a time
```
