[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / watch

# Function: watch()

> **watch**(`listSource`, `callback`, `options`): `void`

Defined in: [watch.ts:27](https://github.com/phonowell/fire-keeper/blob/main/src/watch.ts#L27)

Watch files or directories for changes and execute a callback when changes occur.

## Parameters

### listSource

Single path or array of paths to watch

`string` | `string`[]

### callback

(`path`) => `void`

Function called with the normalized path when changes are detected

### options

`Options` = `...`

Configuration options

## Returns

`void`

## Example

```ts
// Watch a single directory
watch('src', path => {
  console.log(path)
})

// Watch multiple paths with custom debounce
watch(['src', 'config'], path => {
  console.log(`Changed: ${path}`)
}, { debounce: 500 })
```
