[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / backup

# Function: backup()

> **backup**(`source`, `options`): `Promise`\<`void`\>

Defined in: [backup.ts:42](https://github.com/phonowell/fire-keeper/blob/main/src/backup.ts#L42)

Backs up files by creating .bak copies.
For each source file, creates a copy with '.bak' extension in the same directory.
Preserves directory structure, file content (including binary files), and supports special characters in filenames.

## Parameters

### source

A file path or glob pattern(s) to backup. Can be a single string or array of paths.

`string` | `string`[]

### options

`Options` = `{}`

Backup configuration options

## Returns

`Promise`\<`void`\>

Promise that resolves when all backups are complete. If no files match the pattern, resolves without error.

## Throws

If any backup operation fails or if source files cannot be accessed

## Example

```ts
// Backup a single file
backup('file.txt')
// Result: Creates file.txt.bak

// Backup multiple files with pattern
backup(['src/*.ts', 'src/utils/*.ts'])
// Result: Creates .bak files preserving directory structure

// Backup specific files
backup(['file1.txt', 'data/file2.bin'])
// Result: Creates file1.txt.bak and data/file2.bin.bak

// Backup with custom concurrency
backup('*.txt', { concurrency: 2 })
// Result: Processes 2 files at a time

// Supports special characters and non-ASCII filenames
backup(['特殊文件.txt', 'file!@#.dat'])
// Result: Creates 特殊文件.txt.bak and file!@#.dat.bak
```
