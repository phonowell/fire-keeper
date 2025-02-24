[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / backup

# Function: backup()

> **backup**(`source`, `options`): `Promise`\<`void`\>

Defined in: [backup.ts:35](https://github.com/phonowell/fire-keeper/blob/main/src/backup.ts#L35)

Backs up files by creating .bak copies.
For each source file, creates a copy with '.bak' extension in the same directory.

## Parameters

### source

A file path or glob pattern(s) to backup. Can be a single string or array of paths.

`string` | `string`[]

### options

`Options` = `{}`

Backup configuration options

## Returns

`Promise`\<`void`\>

Promise that resolves when all backups are complete

## Throws

If any backup operation fails or if source files cannot be accessed

## Example

```typescript
// Backup a single file
await backup('file.txt')
// Result: Creates file.txt.bak

// Backup multiple files
await backup(['file1.txt', 'file2.txt'])
// Result: Creates file1.txt.bak and file2.txt.bak

// Backup with custom concurrency
await backup('*.txt', { concurrency: 2 })
// Result: Processes 2 files at a time
```
