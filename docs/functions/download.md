[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / download

# Function: download()

> **download**(`url`, `dir`, `filename`?): `Promise`\<`void`\>

Defined in: [download.ts:49](https://github.com/phonowell/fire-keeper/blob/main/src/download.ts#L49)

Downloads a file from a URL and saves it to the specified directory.

## Parameters

### url

`string`

The URL of the file to download

### dir

`string`

The target directory where the file will be saved

### filename?

`string` = `...`

Optional custom filename. If not provided, extracts filename from URL

## Returns

`Promise`\<`void`\>

Promise that resolves when download is complete

## Throws

If:
  - URL response is not ok (non-200 status)
  - Response has no body
  - Network error occurs
  - File system operation fails
  - Stream pipeline fails

## Throws

If:
  - URL is invalid or empty
  - Directory path is invalid or empty

## Example

```typescript
// Basic download with auto-generated filename
await download('https://example.com/file.txt', 'downloads');

// Download with custom filename
await download('https://api.example.com/data', 'data', 'report.json');

// Download to nested directory (created automatically)
await download('https://cdn.example.com/image.png', 'assets/images');

// Error handling
try {
  await download('https://example.com/file.txt', 'downloads');
} catch (error) {
  if (error instanceof TypeError) {
    console.error('Invalid input:', error.message);
  } else {
    console.error('Download failed:', error.message);
  }
}
```
