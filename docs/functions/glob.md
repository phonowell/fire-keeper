[**fire-keeper**](../README.md)

***

[fire-keeper](../README.md) / glob

# Function: glob()

> **glob**(`input`, `options?`): `Promise`\<`ListSource`\>

Defined in: [glob.ts:39](https://github.com/phonowell/fire-keeper/blob/main/src/glob.ts#L39)

Find files using glob patterns with smart caching

## Parameters

### input

`string` | `string`[] | `ListSource`

### options?

`Options`

Search options

## Returns

`Promise`\<`ListSource`\>

Matching paths

## Example

```ts
// Basic matching with exclusions
glob(['src/*.ts', '!src/*.test.ts'])
```
