[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / link

# Function: link()

> **link**(`source`, `target`): `Promise`\<`void`\>

Defined in: [link.ts:39](https://github.com/phonowell/fire-keeper/blob/main/src/link.ts#L39)

Creates a symbolic link from source to target location.

## Parameters

### source

`string`

The source file or directory path to create a link from

### target

`string`

The target path where the symbolic link will be created

## Returns

`Promise`\<`void`\>

- Resolves when link is created successfully

## Throws

When:
  - Source path does not exist
  - Target path is invalid
  - Filesystem operations fail
  - Insufficient permissions

## Example

```typescript
// Create a symlink for a file
await link('source.txt', 'link.txt');

// Create a symlink for a directory
await link('source-dir', 'link-dir');

// Create a symlink with absolute paths
await link('/path/to/source', '/path/to/link');

// Create a symlink with relative paths
await link('./config/default.json', './config/current.json');

// Error handling
try {
  await link('non-existent.txt', 'link.txt');
} catch (error) {
  console.error('Failed to create symlink:', error);
}
```
