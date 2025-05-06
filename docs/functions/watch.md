[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / watch

# Function: watch()

> **watch**(`listSource`, `callback`, `options`): () => `Promise`\<`void`\>

Defined in: [watch.ts:23](https://github.com/phonowell/fire-keeper/blob/main/src/watch.ts#L23)

Watch files or directories for changes and execute a callback when changes occur.

## Parameters

### listSource

Single path or array of paths to watch (uses chokidar's pattern matching,
which may differ from other glob implementations in the project)

`string` | `string`[]

### callback

(`path`) => `void`

Function called with the normalized path when changes are detected

### options

`Options` = `...`

Configuration options

## Returns

Function to close the watcher

> (): `Promise`\<`void`\>

### Returns

`Promise`\<`void`\>

## Example

```ts
watch(['src', 'config'], path => console.log(`Changed: ${path}`), { debounce: 500 })
```
