[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / recover

# Function: recover()

> **recover**(`source`, `options`): `Promise`\<`void`\>

Defined in: [recover.ts:27](https://github.com/phonowell/fire-keeper/blob/main/src/recover.ts#L27)

Recovers files from their backup versions (.bak files)

## Parameters

### source

File path(s) to recover (without .bak extension), supports glob patterns

`string` | `string`[]

### options

`Options` = `{}`

Recovery options

## Returns

`Promise`\<`void`\>

Promise<void> Resolves when all recoveries complete

## Example

```ts
await recover(['config.json', 'data.txt']) // Recovers from .bak files
await recover('*.txt', { concurrency: 3 }) // Processes max 3 files at once
```
