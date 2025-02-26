[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / watch

# Function: watch()

> **watch**(`listSource`, `callback`, `options`): `void`

Defined in: [watch.ts:22](https://github.com/phonowell/fire-keeper/blob/main/src/watch.ts#L22)

Watch the file or directory.

## Parameters

### listSource

The file or directory to watch.

`string` | `string`[]

### callback

(`path`) => `void`

The callback to execute.

### options

`Options` = `...`

The options.

## Returns

`void`

## Example

```
watch('src', path => {
  console.log(path)
})
```
