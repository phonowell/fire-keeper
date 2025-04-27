[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / link

# Function: link()

> **link**(`source`, `target`): `Promise`\<`void`\>

Defined in: [link.ts:18](https://github.com/phonowell/fire-keeper/blob/main/src/link.ts#L18)

Creates a symbolic link from source to target

## Parameters

### source

`string`

Source path (supports glob patterns)

### target

`string`

Target path for the symlink

## Returns

`Promise`\<`void`\>

Resolves when link is created, or silently if no source matches

## Throws

If source exists but link creation fails (e.g., permissions)

## Example

```ts
await link('config.json', 'config.link.json')
await link('configs/*.json', 'current.json') // uses first match
await link('src/', 'link/') // directory (may need elevation on Windows)
```
